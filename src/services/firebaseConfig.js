import { message } from 'antd';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc, 
  serverTimestamp,
} from "firebase/firestore";
import "firebase/compat/firestore";

// Erişim sağlanılması adına env de saklanılmadı!

const firebaseConfig = {
  apiKey: "AIzaSyC0S_3hBP9UEkSxjSNsGcuRGHQLl-rr54M",
  authDomain: "debt-tracking.firebaseapp.com",
  projectId: "debt-tracking",
  storageBucket: "debt-tracking.appspot.com",
  messagingSenderId: "1018555643762",
  appId: "1:1018555643762:web:921589edff982302410feb"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore }; 


export const registerUser = async (email, password, name) => {
  try {
    // Yeni kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore'da kullanıcıyı oluştur
    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
    });

    // Başarılı kayıt olduktan sonra yönlendirme işlemi
    window.location.href = '/login'; // veya istediğiniz başka bir URL

    return user;
  } catch (error) {
    console.error("Firestore'a kullanıcı eklenirken bir hata oluştu:", error);
    message.error("Hatalı Giriş!");
    return null;
  }
}


export const loginUser = async (email, password) => {
  try {
  
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user;
  } catch (error) {
    console.error("Kullanıcı girişi yapılırken bir hata oluştu:", error);
    message.error("Hatalı Giriş!");
    return null;
  }
}

const addDebtToFirestore = async (userId, debtData, monthlyPayments) => {
  try {
    
    const userDebtsRef = collection(firestore, 'users', userId, 'user_debts');

 
    const docRef = await addDoc(userDebtsRef, {
      debtName: debtData.debtName,
      lenderName: debtData.lenderName,
      debtAmount: debtData.debtAmount,
      interestRate: debtData.interestRate,
      paymentStart: debtData.paymentStart,
      installment: debtData.installment,
      description: debtData.description,
      createdAt: serverTimestamp(), 
      monthlyPayments: monthlyPayments.map(payment => ({
        ...payment,
        paymentStatus: 'Ödenmedi' 
      }))
    });

    console.log("Borç Firestore'a başarıyla eklendi. Belge ID:", docRef.id);
    return docRef.id; 
  } catch (error) {
    console.error("Borç Firestore'a eklenirken bir hata oluştu:", error);
    throw error; 
  }
};



export { addDebtToFirestore };


export const getUserDebtsFromFirestore = async (userId) => {
  try {
    const userDebtsRef = collection(firestore, 'users', userId, 'user_debts');
    const snapshot = await getDocs(userDebtsRef);
    const debts = [];

    snapshot.forEach((doc) => {
      debts.push({ id: doc.id, ...doc.data() });
    });

    return debts;
  } catch (error) {
    console.error("Kullanıcının borçları alınırken bir hata oluştu:", error);
    return [];
  }
};

export const updateDebtInFirestore = async (userId, debtId, updatedDebtData) => {
  try {
    const debtRef = doc(collection(firestore, 'users', userId, 'user_debts'), debtId);
    await updateDoc(debtRef, updatedDebtData);
  } catch (error) {
    console.error('Borç güncellenirken bir hata oluştu:', error);
    throw error;
  }
};



