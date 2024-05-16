import database from '@react-native-firebase/database';

class _CallMethods {
  add_call_in_firebase = ({
    astroID = null,
    customerData = null,
    rat = 0,
    duration = 0,
    orderId = null,
  }) => {
    try {
      database().ref(`CurrentCallRequest/${astroID}`).set({
        customer_name: customerData?.username,
        gender: customerData?.gender,
        total_duration: duration,
        birth_date: customerData?.date_of_birth,
        birth_time: customerData?.time_of_birth,
        birth_place: customerData?.place_of_birth,
        current_address: customerData?.current_address,
        problem_area: customerData?.problem,
        order_time: new Date().getTime(),
        rate: rat,
        customer_id: customerData?.id,
        status: 'active',
        order_id: orderId
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export const CallMethods = new _CallMethods();
