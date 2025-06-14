import { v4 as uuidv4 } from 'uuid';

const IdGenerator = {
  generateNumberId: () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },
  generateReferralCode: () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  },
  // generateId: () => {
  //     const id = Math.floor(1000 + Math.random() * 9000)
  //     return id.toString()
  // }
  generateId: () => {
    return uuidv4();
  },

  generateSerialId: (prefix: string, lastIdNumber: number, length: number = 5): string => {
    const newNumber = (lastIdNumber + 1).toString().padStart(length, '0');
    return `${prefix}-${newNumber}`;
  },
};

export default IdGenerator;
