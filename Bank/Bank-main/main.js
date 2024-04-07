import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// Customer class
class Customer {
    constructor(fName, lName, age, gender, mobileNo, accountNum) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobileNo = mobileNo;
        this.accountNum = accountNum;
    }
}
// Class bank
class Bank {
    constructor() {
        this.customers = [];
        this.accounts = [];
    }
    addCustomer(obj) {
        this.customers.push(obj);
    }
    addAccountno(obj) {
        this.accounts.push(obj);
    }
    transaction(accobj) {
        let newAccount = this.accounts.filter(accounts => accounts.accountNum !== accobj.accountNum);
        this.accounts = [...newAccount, accobj];
    }
}
let myBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let mobileNo = parseInt(faker.phone.number("3##########"));
    const cus = new Customer(fName, lName, 25 * i, "male", mobileNo, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountno({ accountNum: cus.accountNum, balance: 1000 * i });
}
//bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number"
            });
            let account = myBank.accounts.find((account) => account.accountNum == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid account number"));
            }
            if (account) {
                let name = myBank.customers.find((item) => item.accountNum == account?.accountNum);
                console.log(`Dear ${chalk.green.bold.italic(name?.firstName)} ${chalk.green.bold.italic(name?.lastName)} your account balance is ${chalk.bold
                    .blue(`$${account.balance}`)}`);
            }
        }
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number"
            });
            let account = myBank.accounts.find((account) => account.accountNum == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount",
                    name: "rupee"
                });
                if (ans.rupee > account.balance) {
                    console.log("Insufficient Balance");
                }
                let newBalnce = account.balance - ans.rupee;
                //transaction method
                bank.transaction({ accountNum: account.accountNum, balance: newBalnce });
            }
        }
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number"
            });
            let account = myBank.accounts.find((account) => account.accountNum == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount",
                    name: "rupee"
                });
                let newBalance = account.balance + ans.rupee;
                // Assuming bank is an object with a transaction method
                bank.transaction({ accountNum: account.accountNum, balance: newBalance });
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
