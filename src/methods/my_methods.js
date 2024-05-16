import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment';
import {Linking} from 'react-native';

class _MyMethods {
  getPercentageData({principalAmount = 0, discountAmount = 0}) {
    return (
      100 -
      parseFloat(
        (parseFloat(discountAmount) / parseFloat(principalAmount)) * 100,
      ).toFixed(2)
    );
  }

  getSecondsBetweenTimestamps({
    timestamp1 = new Date(),
    timestamp2 = new Date(),
  }) {
    const date1 = new Date(timestamp1 / 1000);
    const date2 = new Date(timestamp2 / 1000);
    const timeDifferenceMilliseconds = Math.abs(date2 - date1);
    const timeDifferenceSeconds = timeDifferenceMilliseconds;
    return timeDifferenceSeconds;
  }

  sum_price = ({
    firstPrice = 0,
    secondPrice = 0,
    thirdPrice = 0,
    fourthPrice = 0,
  }) => {
    return firstPrice + secondPrice + thirdPrice + fourthPrice;
  };

  calculate_discount_price = ({actualPrice, percentage}) => {
    let discountedPrice =
      (parseFloat(actualPrice) * parseFloat(percentage)) / 100;
    return parseFloat(parseFloat(actualPrice) - discountedPrice).toFixed(2);
  };

  add_uid_in_firebase = ({userId = null, uid = ''}) => {
    database()
      .ref(`/UserId/${userId}`)
      .set(uid)
      .then(async res => {
        await AsyncStorage.setItem('FirebaseId', uid.toString());
      })
      .catch(err => {
        console.log(err);
      });
  };

  create_firebase_account = async ({userId = null, userAccount = null}) => {
    await auth()
      .createUserWithEmailAndPassword(`${userAccount}@gmail.com`, '12345678')
      .then(response => {
        this.add_uid_in_firebase({userId: userId, uid: response.user.uid});
      })
      .catch(async err => {
        await auth()
          .signInWithEmailAndPassword(`${userAccount}@gmail.com`, '12345678')
          .then(response => {
            this.add_uid_in_firebase({userId: userId, uid: response.user.uid});
          });
        console.log(err);
      });
  };

  download_file = ({uri = null}) => {
    try {
      Linking.openURL(uri)
        .then(() => {
          console.log('opened');
        })
        .catch(err => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  check_current_day = ({date = new Date(), type = 'equal'}) => {
    try {
      const targetDate = new Date(moment(date).format('YYYY-MM-DD'));
      const today = new Date();
      if (type == 'equal') {
        if (
          targetDate.getDate() === today.getDate() &&
          targetDate.getMonth() === today.getMonth() &&
          targetDate.getFullYear() === today.getFullYear()
        ) {
          return true;
        }
        return false;
      } else if (type == 'greater') {
        if (
          targetDate.getDate() >= today.getDate() &&
          targetDate.getMonth() >= today.getMonth() &&
          targetDate.getFullYear() >= today.getFullYear()
        ) {
          return true;
        }
        return false;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  check_is_cart_empty = async () => {
    try {
      const data = await AsyncStorage.getItem('eCommerceCart');
      const eCommerceCart = JSON.parse(data);
      console.log(eCommerceCart)
      if (eCommerceCart) {
        return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  generateUniqueId = () => {
    const timestamp = Date.now().toString(16); // Convert current timestamp to hexadecimal
    const randomString = Math.random().toString(16).substr(2, 8); // Generate a random hexadecimal string

    // Combine timestamp and random string, and ensure it is 16 characters long
    const uniqueId = (timestamp + randomString).substr(0, 16);

    return uniqueId;
  }

}

export const MyMethods = new _MyMethods();
