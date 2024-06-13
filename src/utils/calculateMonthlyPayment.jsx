export function calculateMonthlyPayment(debtAmount, interestRate, installment, paymentStart) {
    const monthlyInterestRate = interestRate / 100;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, installment);
    const denominator = Math.pow(1 + monthlyInterestRate, installment) - 1;
    const monthlyPayment = debtAmount * numerator / denominator;

    const monthlyPayments = [];
    let remainingAmount = debtAmount;

    const startDate = new Date(paymentStart);
    for (let i = 0; i < installment; i++) {
        const interestPayment = remainingAmount * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingAmount -= principalPayment;
        const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, startDate.getDate());
        monthlyPayments.push({
            amount: monthlyPayment.toFixed(2),
            principal: principalPayment.toFixed(2),
            interest: interestPayment.toFixed(2),
            remainingAmount: remainingAmount.toFixed(2),
            date: paymentDate.toLocaleDateString('tr-TR')
        });
    }

    return monthlyPayments
}
