import DateTimePicker from '@react-native-community/datetimepicker';

export const DatePickerIos = ({
  updateState,
  date,
  maximumDate = null,
  minimumDate = null,
}) => {
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={date == null ? new Date() : date}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
};

export const TimePickerIos = ({updateState, time}) => {};
