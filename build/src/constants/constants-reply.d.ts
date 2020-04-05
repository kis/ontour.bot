declare const REPLY_OPTIONS: {
    "parse_mode": string;
    "reply_markup": string;
};
declare const REPLY_LOCATION: {
    "parse_mode": string;
    "reply_markup": {
        "one_time_keyboard": boolean;
        "keyboard": (string[] | {
            text: string;
            request_location: boolean;
        }[])[];
    };
};
declare const KEYBOARD_NEXT_OPTIONS: (lang: any) => {
    "parse_mode": string;
    "reply_markup": string;
};
declare const KEYBOARD_LANGUAGE_OPTIONS: {
    "parse_mode": string;
    "reply_markup": string;
};
export { KEYBOARD_LANGUAGE_OPTIONS, KEYBOARD_NEXT_OPTIONS, REPLY_OPTIONS, REPLY_LOCATION };
