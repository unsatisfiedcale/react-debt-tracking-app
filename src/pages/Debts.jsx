// Gereksinimlerinizi içeri aktarın
import React, { useState, useEffect } from "react";
import Layout from "../layout";
import {
  addDebtToFirestore,
  auth,
  getUserDebtsFromFirestore,
  updateDebtInFirestore,
} from "../services/firebaseConfig";
import { message } from "antd"; // Ant Design'daki message bileşenini içe aktar
import { calculateMonthlyPayment } from "../utils/calculateMonthlyPayment";

function Debts() {
  // State'ler
  const [showModal, setShowModal] = useState(false); // Modal açma durumu
  const [userDebts, setUserDebts] = useState([]); // Kullanıcının borçlarını tutacak state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [debtName, setDebtName] = useState("");
  const [lenderName, setLenderName] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [paymentStart, setPaymentStart] = useState("");
  const [installment, setInstallment] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDebtId, setSelectedDebtId] = useState(null);
  useEffect(() => {
    const fetchUserDebts = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const debts = await getUserDebtsFromFirestore(userId);
        setUserDebts(debts);
      }
    };

    fetchUserDebts();
  }, []);

  const handleAddDebt = async () => {
    if (
      !debtName ||
      !lenderName ||
      !debtAmount ||
      !interestRate ||
      !paymentStart ||
      !installment
    ) {
      message.error("Lütfen tüm zorunlu alanları doldurun.");
      return; 
    }

    const debtData = {
      debtName: debtName,
      lenderName: lenderName,
      debtAmount: debtAmount,
      interestRate: interestRate,
      paymentStart: paymentStart,
      installment: installment,
      description: description,
    };
  
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
  
        const monthlyPayments = calculateMonthlyPayment(debtAmount, interestRate, installment, paymentStart);
  
        await addDebtToFirestore(userId, debtData, monthlyPayments);
        console.log("Borç ve aylık ödemeler Firestore'a başarıyla eklendi");
  
        message.success("Ödeme Planı Oluşturuldu!");
  
        const debts = await getUserDebtsFromFirestore(userId);
        setUserDebts(debts);
      } else {
        console.error("Kullanıcı oturumu bulunamadı.");
        message.error("Ödeme planı oluşturulamadı!");
      }
    } catch (error) {
      console.error("Borç eklenirken bir hata oluştu:", error);
      message.error("Ödeme planı oluşturulamadı!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDebtName("");
    setLenderName("");
    setDebtAmount("");
    setInterestRate("");
    setPaymentStart("");
    setInstallment("");
    setDescription("");
  };

  const handleShowPlanModal = (debtId) => {
    const selectedDebt = userDebts.find((debt) => debt.id === debtId);

    if (!selectedDebt) {
      console.error("Belirtilen borç bulunamadı.");
      return;
    }

    setSelectedDebtId(debtId);

    setDebtName(selectedDebt.debtName);
    setLenderName(selectedDebt.lenderName);
    setDebtAmount(selectedDebt.debtAmount);
    setInterestRate(selectedDebt.interestRate);
    setPaymentStart(selectedDebt.paymentStart);
    setInstallment(selectedDebt.installment);
    setDescription(selectedDebt.description);

    setShowPlanModal(true);
  };

  const handleUpdateDebt = async () => {
    if (
      !debtName ||
      !lenderName ||
      !debtAmount ||
      !interestRate ||
      !paymentStart ||
      !installment
    ) {
      message.error("Lütfen tüm zorunlu alanları doldurun.");
      return; 
    }

    const debtData = {
      debtName: debtName,
      lenderName: lenderName,
      debtAmount: debtAmount,
      interestRate: interestRate,
      paymentStart: paymentStart,
      installment: installment,
      description: description,
    };

    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        const debtId = selectedDebtId;

        await updateDebtInFirestore(userId, debtId, debtData);

        console.log("Borç Firestore'da başarıyla güncellendi");

        message.success("Ödeme Planı Güncellendi!");

        const debts = await getUserDebtsFromFirestore(userId);
        setUserDebts(debts);

        setShowPlanModal(false);
      } else {
        console.error("Kullanıcı oturumu bulunamadı.");
        message.error("Ödeme planı güncellenemedi!");
      }
    } catch (error) {
      console.error("Borç güncellenirken bir hata oluştu:", error);
      message.error("Ödeme planı güncellenemedi!");
    }
  };

  return (
    <div>
      <Layout>
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowModal(true)} 
          >
            Yeni Borç Oluştur
          </button>
        </div>

      
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal} 
          >
            <div
              className="bg-white rounded-lg p-8 max-w-md"
              onClick={(e) => e.stopPropagation()} 
            >
              <h2 className="text-xl font-bold mb-4">Yeni Borç Oluştur</h2>
           
              <div className="mb-4">
                <label className="block mb-1" htmlFor="debtName">
                  Borç Adı
                </label>
                <input
                  id="debtName"
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="lenderName">
                  Borcu Veren Kişi/Kurum
                </label>
                <input
                  id="lenderName"
                  type="text"
                  className=" shadow appearance-none rounded w-full border border-gray-300  leading-tight focus:outline-none focus:shadow-outline px-3 py-2 "
                  value={lenderName}
                  onChange={(e) => setLenderName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="debtAmount">
                  Borç Tutarı
                </label>
                <input
                  id="debtAmount"
                  type="number"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="interestRate">
                  Aylık Faiz Oranı (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="paymentStart">
                  Ödeme Başlangıç Tarihi
                </label>
                <input
                  id="paymentStart"
                  type="date"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={paymentStart}
                  onChange={(e) => setPaymentStart(e.target.value)}
                />
              </div>
              {/* Taksit Sayısı */}
              <div className="mb-4">
                <label className="block mb-1" htmlFor="installment">
                  Taksit Sayısı
                </label>
                <input
                  id="installment"
                  type="number"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={installment}
                  onChange={(e) => setInstallment(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="description">
                  Borç Açıklaması
                </label>
                <textarea
                  id="description"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={closeModal}
                >
                  İptal
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    handleAddDebt();
                    closeModal();
                  }}
                >
                  Ödeme Planı Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {showPlanModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
              <div className="border-b px-4 py-2 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Borç Detayları</h3>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-black close-modal"
                >
                  &times;
                </button>
              </div>
              <div className="p-4">
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Borç Adı
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={debtName}
                    onChange={(e) => setDebtName(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Borcu Veren Kişi/Kurum
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={lenderName}
                    onChange={(e) => setLenderName(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Borç Tutarı
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={debtAmount}
                    onChange={(e) => setDebtAmount(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Aylık Faiz Oranı (%)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ödeme Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={paymentStart}
                    onChange={(e) => setPaymentStart(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Taksit Sayısı
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={installment}
                    onChange={(e) => setInstallment(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Borç Açıklaması
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Kapat
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleUpdateDebt} // handleUpdateDebt fonksiyonunu çağır
                  >
                    Ödeme Planını Güncelle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 max-w-screen-lg mx-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Borç Adı</th>
                <th className="px-4 py-2 border">Borç Veren</th>
                <th className="px-4 py-2 border">Borç Miktarı</th>
                <th className="px-4 py-2 border">Faiz Oranı</th>
                <th className="px-4 py-2 border">Başlangıç Tarihi</th>
                <th className="px-4 py-2 border">Düzenle</th>
                <th className="px-4 py-2 border">Ödeme Planı Gör</th>
              </tr>
            </thead>
            <tbody>
              {userDebts.map((debt, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{debt.debtName}</td>
                  <td className="border px-4 py-2">{debt.lenderName}</td>
                  <td className="border px-4 py-2">{debt.debtAmount}</td>
                  <td className="border px-4 py-2">{debt.interestRate}</td>
                  <td className="border px-4 py-2">{debt.paymentStart}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleShowPlanModal(debt.id)}
                    >
                      Düzenle
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                      Ödeme Planını Gör
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
}

export default Debts;
