import dayjs from "dayjs";
import 'dayjs/locale/ko';
dayjs.locale('ko');

export const formatTimeRange = (startDateTime: string, endDateTime: string) => {
    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);

    const dayOfWeek = start.format('dd');
    const startTime = start.format('A hh:mm');
    const endTime = end.format('A hh:mm');

    return `${dayOfWeek} ${startTime} - ${endTime}`;
}
