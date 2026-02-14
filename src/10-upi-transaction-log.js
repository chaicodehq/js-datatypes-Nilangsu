/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  // Your code here
  if(!Array.isArray(transactions)||transactions.length===0){
    return null;
  }
  let validTransactions=transactions.filter(txn=>typeof txn==="object"&&txn!==null&& Number.isFinite(txn.amount)&& txn.amount>0 && (txn.type==="credit"||txn.type==="debit"));

  if(validTransactions.length===0){
    return null;
  }

  let totalCredit = validTransactions.filter(txn=>txn.type==="credit").reduce((accum,current)=>accum+current.amount,0);
  let totalDebit=validTransactions.filter(txn=>txn.type==="debit").reduce((accum,current)=>accum+current.amount,0);
  let netBalance=totalCredit-totalDebit;
  let transactionCount=validTransactions.length;
  let totalAmount=validTransactions.reduce((accum,current)=>accum+current.amount,0);
  let avgTransaction=Math.round(totalAmount/transactionCount);

  let highestTransaction=validTransactions.reduce((accum,current)=>current.amount>accum.amount?current:accum);
  let categoryBreakdown=transactions.reduce((accum,current)=>{
    if(accum[current.category]){
      accum[current.category] = accum[current.category] + current.amount;
    }else{
      accum[current.category] = current.amount;
    }
    return accum;
  }, {});


  let contactCount=validTransactions.reduce((accum, current)=>{
    if(accum[current.to]===undefined){
      accum[current.to]=1;
    }else{
      accum[current.to]=accum[current.to]+1;
    }
    return accum;
  }, {});


  let frequentContact=Object.entries(contactCount).reduce((accum,current)=>current[1]>accum[1]?current:accum)[0];

  let allAbove100=validTransactions.every(txn=>txn.amount>100);
  let hasLargeTransaction=validTransactions.some(txn=>txn.amount>=5000);

  return {totalCredit:totalCredit, totalDebit:totalDebit, netBalance:netBalance, transactionCount:transactionCount, avgTransaction:avgTransaction, highestTransaction:{...highestTransaction}, categoryBreakdown:categoryBreakdown, frequentContact:frequentContact,
    allAbove100:allAbove100, hasLargeTransaction:hasLargeTransaction}
}
