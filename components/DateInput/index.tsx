import { twMerge } from "tailwind-merge";
import DatePicker from "react-datepicker";
import moment from "moment";

import { US_DATETIME_FORMAT, US_DATEONLY_FORMAT } from "@/libs/constants";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  setValue: Function;
  sname?: string;
  id?: string;
  isTime? : boolean;
};

const DateInput = ({
  label,
  placeholder,
  value,
  setValue,
  sname,
  id,
  isTime = true,
}: Props) => {
  return (
    <div className="w-full py-2 flex flex-col space-y-1">
      <label htmlFor={id} className="w-full text-sm">
        {sname}
      </label>
      <div
        className={twMerge(
          "w-full flex flex-row bg-[#24292d] justify-start items-center py-4 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg transition-all duration-300"
        )}
      >
        <DatePicker
          className="w-full flex text-primary text-sm placeholder-secondary bg-transparent outline-none border-none focus:outline-none focus:border-none"
          selected={value ? moment(value).toDate() : new Date()}
          onChange={(date) => setValue(date)}
          dateFormat={isTime ? US_DATETIME_FORMAT : US_DATEONLY_FORMAT}
          placeholderText={placeholder}
          showTimeSelect = {isTime}
          timeFormat={isTime ? "HH:mm" : ""}
          timeIntervals={isTime? 15 : 0}
          timeCaption={isTime ? "Time" : ""}
        />
      </div>
    </div>
  );
};

export default DateInput;
