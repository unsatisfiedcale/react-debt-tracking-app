import React, { useState, useEffect } from "react";
import Layout from "../layout";
import PaymentDetailsModal from "../utils/paymentDetailsModal";
import {auth, getUserDebtsFromFirestore} from "../services/firebaseConfig";

function PaymentPlan() {
  const [userDebts, setUserDebts] = useState([]);
  const [selectedDebt, setSelectedDebt] = useState(null);

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

  const openModal = (debt) => {
    setSelectedDebt(debt);
  };

  const closeModal = () => {
    setSelectedDebt(null);
  };

  return (
    <div>
      <Layout>
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 max-w-screen-lg mx-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Borç Adı</th>
                <th className="px-4 py-2 border">Borç Veren</th>
                <th className="px-4 py-2 border">Borç Miktarı</th>
                <th className="px-4 py-2 border">Faiz Oranı</th>
                <th className="px-4 py-2 border">Başlangıç Tarihi</th>
                <th className="px-4 py-2 border">Taksit</th>
                <th className="px-4 py-2 border">Ödeme Detay</th>
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
                  <td className="border px-4 py-2">{debt.installment}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => openModal(debt)} // Modalı aç
                    >
                      Ödeme Detayı
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
      <PaymentDetailsModal debt={selectedDebt} closeModal={closeModal} />
    </div>
  );
}

export default PaymentPlan;
