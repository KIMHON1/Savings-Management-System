import EventEmitter from 'events';

class Alerts extends EventEmitter {}

const alerts = new Alerts();

// Example listeners (console). Replace with email/SMS/WebSocket as needed.
alerts.on('depositConfirmed', ({ userId, transaction }) => {
    console.log(`[ALERT] Deposit confirmed for user ${userId}. Transaction ${transaction._id} amount ${transaction.amount}`);
});

alerts.on('withdrawal', ({ userId, transaction }) => {
    console.log(`[ALERT] Withdrawal by user ${userId}. Transaction ${transaction._id} amount ${transaction.amount}`);
});

alerts.on('lowBalance', ({ userId, balance }) => {
    console.log(`[WARNING] Low balance for user ${userId}. Current balance: ${balance}`);
});

alerts.on('deviceVerificationCode', ({ userId, code, fingerprint }) => {
    console.log(`[DEVICE] Send verification code ${code} for user ${userId} and device ${fingerprint}`);
});

alerts.on('successfulLogin', ({ userId, fingerprint }) => {
    console.log(`[LOGIN] Successful login for user ${userId} from device ${fingerprint}`);
});

export default alerts;
