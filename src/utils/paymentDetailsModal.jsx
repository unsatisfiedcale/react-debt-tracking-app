import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { calculateMonthlyPayment } from "./calculateMonthlyPayment";
import { addDebtToFirestore, updateDebtInFirestore, } from "../services/firebaseConfig";


function PaymentDetailsModal({ debt, closeModal }) {
  const [visible, setVisible] = useState(false);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);

  useEffect(() => {
    if (debt) {
      setVisible(true); 
      const payments = calculateMonthlyPayment(debt.debtAmount, debt.interestRate, debt.installment, debt.paymentStart);
      setMonthlyPayments(payments);
      setPaymentStatus(new Array(payments.length).fill(false)); 
      
      addDebtToFirestore(debt.userId, debt.id, payments)
        .then(() => console.log("Aylık ödemeler Firestore'a başarıyla eklendi."))
        .catch(error => console.error("Aylık ödemeler Firestore'a eklenirken bir hata oluştu:", error));
    }
  }, [debt]);

  const handlePaymentToggle = async (index) => {
    try {
      const newStatus = [...paymentStatus];
      newStatus[index] = !newStatus[index];
      setPaymentStatus(newStatus);
  
      const updatedPayments = monthlyPayments.map((payment, i) => ({
        ...payment,
        isPaid: newStatus[i], 
        paymentStatus: newStatus[i] ? 'Ödendi' : 'Ödenmedi'
      }));
  
      await updateDebtInFirestore(debt.userId, debt.id, { monthlyPayments: updatedPayments });
    } catch (error) {
      console.error("Ödeme durumu güncellenirken bir hata oluştu:", error);
    }
  };
    
  
  return (
    <Modal
      title="Ödeme Detayları"
      visible={visible}
      onCancel={() => {
        setVisible(false);
        closeModal(); 
      }}
      footer={[
        <Button key="close" onClick={() => {
          setVisible(false);
          closeModal(); 
        }}>
          Kapat
        </Button>,
      ]}
    >
      <p className="text-lg font-semibold mb-4">Aylık Ödemeler:</p>
      <ul className="space-y-4">
        {monthlyPayments.map((payment, index) => (
          <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
            <span className="text-gray-600">{payment.date}</span>
            <span className="font-medium">{payment.amount} TL</span>
            <div>
              {paymentStatus[index] ? (
                <button 
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handlePaymentToggle(index)}
                >
                  ✓ Ödendi
                </button>
              ) : (
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handlePaymentToggle(index)}
                >
                  Ödendi olarak işaretle
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

export default PaymentDetailsModal;
