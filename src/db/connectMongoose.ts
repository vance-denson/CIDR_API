import mongoose from 'mongoose';

export const dbConnect = (credentials: string) => {
  try {
    mongoose.connect(credentials, {}, () => {
      // return console.info(`Successful connection to ${credentials}`);
      // console.info('Server Started...');
    });
  } catch (error) {
    console.error('Error connecting to database: ', error);
    return;
  }
};
