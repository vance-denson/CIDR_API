import mongoose from 'mongoose';

// type uriInput = {
//   db: string | undefined;
// };

export const dbConnect = (db: string) => {
  try {
    mongoose.connect(db, {}, () => {
      return console.info(`Successful connection to ${db}`);
    });
  } catch (error) {
    console.error('Error connecting to database: ', error);
    return;
  }
  console.log('Mongoose Connected!');
  return mongoose.connect(db);
};
