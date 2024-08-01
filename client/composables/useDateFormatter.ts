import moment from 'moment';

export function useDateFormatter() {
  const formatDate = (date: string) => {
    return moment(date).format('DD-MM-YYYY');
  };

  return {
    formatDate,
  };
}
