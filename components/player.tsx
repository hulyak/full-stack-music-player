import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from "@chakra-ui/react";
import ReactHowler from "react-howler";
import { useEffect, useRef, useState } from "react";
import {
  MdShuffle,
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
} from "react-icons/md";
import { useStoreActions } from "easy-peasy";
import { formatTime } from "../lib/formatters";

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(
    songs.findIndex((s) => s.id === activeSong.id) // keep track of the current song
  );
  const [seek, setSeek] = useState(0.0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0.0);

  const soundRef = useRef(null);
  const repeatRef = useRef(repeat);

  const setActiveSong = useStoreActions((state: any) => state.changeActiveSong);

  useEffect(() => {
    let timerId;

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek()); // update seek
        timerId = requestAnimationFrame(f); // loop recursive
      };

      timerId = requestAnimationFrame(f);
      return () => cancelAnimationFrame(timerId); // clean up
    }

    cancelAnimationFrame(timerId); // if not playing, cancel the loop
  }, [playing, isSeeking]);

  useEffect(() => {
    setActiveSong(songs[index]);
  }, [index, setActiveSong, songs]);

  useEffect(() => {
    repeatRef.current = repeat; // keep track of the repeat state
  }, [repeat]);

  const setPlayState = (value) => setPlaying(value);

  const onShuffle = () => setShuffle((state) => !state);

  const onRepeat = () => setRepeat((state) => !state);

  const prevSong = () =>
    setIndex((state) => (state ? state - 1 : songs.length - 1)); // if index is 0, set to last song

  const nextSong = () => {
    setIndex((state) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length);

        if (next === state) {
          return nextSong(); // if the next song is the same as the current song, try again
        }
        return next;
      }

      return state === songs.length - 1 ? 0 : state + 1; // if index is last song, set to first song
    });
  };

  const onEnd = () => {
    if (repeatRef.current) {
      // if repeat is on, reset seek to 0 and play again
      setSeek(0);
      soundRef.current.seek(0);
    } else {
      nextSong();
    }
  };

  const onLoad = () => setDuration(soundRef.current.duration()); // set duration of song

  const onSeek = (e) => {
    setSeek(parseFloat(e[0])); // set seek to the value of the slider
    soundRef.current.seek(e[0]); // seek to the value of the slider
  };

  return (
    <Box>
      <Box>
        <ReactHowler
          playing={playing}
          src={activeSong?.url}
          ref={soundRef}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          {/* Shuffle Button */}
          <IconButton
            outline="none"
            variant="link"
            aria-label="shuffle"
            fontSize="24px"
            color={shuffle ? "white" : "gray.600"}
            onClick={onShuffle}
            icon={<MdShuffle />}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="skip"
            fontSize="24px"
            icon={<MdSkipPrevious />}
            onClick={prevSong}
          />
          {/* If it's playing, display the pause icon */}
          {playing ? (
            <IconButton
              outline="none"
              variant="link"
              aria-label="pause"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePauseCircleFilled />}
              onClick={() => setPlayState(false)}
            />
          ) : (
            <IconButton
              outline="none"
              variant="link"
              aria-label="play"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlayState(true)}
            />
          )}

          <IconButton
            outline="none"
            variant="link"
            aria-label="next"
            fontSize="24px"
            icon={<MdSkipNext />}
            onClick={nextSong}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="repeat"
            fontSize="24px"
            color={repeat ? "white" : "gray.600"}
            onClick={onRepeat}
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>

      {/* Seek bar */}
      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">
              {
                formatTime(seek) // display the current seek time
              }
            </Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={["min", "max"]}
              step={0.1} // increments of 0.1
              min={0}
              id="player-range"
              max={duration ? (duration.toFixed(2) as unknown as number) : 0}
              onChange={onSeek}
              value={[seek]} // set the value of the slider to the current seek
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          {/* Duration */}
          <Box width="10%" textAlign="right">
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
