import React, { useCallback } from "react";
import { Icon } from "antd";
export const MicrophoneIconSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 352 512"
    >
      <path
        fill="currentColor"
        d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"
      />
    </svg>
  );
};
export const MicrophoneIconMutedSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      width="1em"
      height="1em"
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M633.82 458.1l-157.8-121.96C488.61 312.13 496 285.01 496 256v-48c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v48c0 17.92-3.96 34.8-10.72 50.2l-26.55-20.52c3.1-9.4 5.28-19.22 5.28-29.67V96c0-53.02-42.98-96-96-96s-96 42.98-96 96v45.36L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM400 464h-56v-33.77c11.66-1.6 22.85-4.54 33.67-8.31l-50.11-38.73c-6.71.4-13.41.87-20.35.2-55.85-5.45-98.74-48.63-111.18-101.85L144 241.31v6.85c0 89.64 63.97 169.55 152 181.69V464h-56c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16z"
      />
    </svg>
  );
};

export const MicrophoneIcon = (props) => (
  <Icon component={MicrophoneIconSvg} {...props} />
);

export const MicrophoneIconMuted = (props) => (
  <Icon component={MicrophoneIconMutedSvg} {...props} />
);
export const MicrophoneButton = ({ muted, toggle, ...propsToPass }) => {
  // const [isMuted, setIsMuted] = useState(() => (muted ? muted : false));

  const doToggle = useCallback(() => {
    // setIsMuted(!isMuted);
    if (toggle !== null && toggle !== undefined) {
      toggle();
    }
  }, [toggle]);
  return (
    // <Button shape="circle" size="large" onClick={toggle}>
    <span onClick={doToggle} {...propsToPass}>
      {muted === false && (
        <MicrophoneIcon className="text-black"></MicrophoneIcon>
      )}
      {muted === true && (
        <MicrophoneIconMuted className="text-black"></MicrophoneIconMuted>
      )}
    </span>
    // </Button>
  );
};
