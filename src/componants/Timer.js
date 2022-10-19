//import { calculateNewValue } from "@testing-library/user-event/dist/utils";
import {useState, useEffect, useRef} from 'react';
import {Text} from 'react-native';

//i hate myself i'm not a developer i'm a loser
export default function Timer({gameTime, style}) {
  const calculateTimeRemaining = gameTime => {
    const now = new Date();
    const later = new Date();
    let hours = parseInt(gameTime.split(':')[0]);
    const minutes = parseInt(gameTime.split(':')[1]);
    hours = gameTime.includes('PM') ? hours + 12 : hours;

    later.setHours(hours, minutes);
    const rem = new Date(later - now);

    return {
      hours: rem.getHours(),
      minutes: rem.getMinutes(),
      seconds: rem.getSeconds(),
    };
  };
  const [time, setTime] = useState(calculateTimeRemaining(gameTime));

  const timerId = useRef(null);

  const counter = () => {
    //when the times up stop the function

    if (seconds === minutes && hours === 0 && minutes === hours) {
      clearInterval(timerId);
      console.log("time's up");
      return;
    }

    if (seconds === 0) {
      seconds = 59;

      if (minutes === 0) {
        hours--;
        minutes = 59;
      } else {
        minutes--;
      }
    } else {
      seconds--;
    }

    setTime({hours, minutes, seconds});
  };

  useEffect(() => {
    timerId.current = setInterval(counter, 1000);
  }, []);

  let timer = '00:00:00';

  let hours = time.hours;
  let minutes = time.minutes;
  let seconds = time.seconds;
  timer = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return <Text style={style}>{timer}</Text>;
}
