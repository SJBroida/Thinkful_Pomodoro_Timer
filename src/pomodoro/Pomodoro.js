import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration"
import { secondsToDuration } from "../utils/duration"

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  /**
   * Called whenever the stop button is clicked
   */
  function stopPomodoro() {

    setIsTimerRunning(() => false);
    setSession(() => null);
    setFocusDuration(focusDuration);
    setBreakDuration(breakDuration);

  }

  /**
   * Called whenever the "+" or "-" focus button is pushed
   * @param amount 
   *    the amount to change the duration (positive or negative)
   */
  function changeFocus(amount) {
    if(amount > 0) {
      // If the amount is greater than zero, make sure it doesn't go over 60
      const newDuration = Math.min(focusDuration + amount, 60);
      // Set the new break duration
      setFocusDuration(newDuration);
    } else {
      // If the amount is less than zero, make sure it doesn't go below 5
      const newDuration = Math.max(5, focusDuration + amount);
      // Set the new break duration
      setFocusDuration(newDuration);
    }
  }

  /**
   * Called whenever the "+" or "-" break button is pushed
   * @param amount 
   *    the amount to change the duration (positive or negative)
   */
  function changeBreak(amount) {
    if(amount > 0) {
      // If the amount is greater than zero, make sure it doesn't go over 15
      const newDuration = Math.min(breakDuration + amount, 15);
      // Set the new break duration
      setBreakDuration(newDuration);
    } else {
      // If the amount is less than zero, make sure it doesn't go below 1
      const newDuration = Math.max(1, breakDuration + amount);
      // Set the new break duration
      setBreakDuration(newDuration);
    }
  }

  /**
   * 
   * @returns 
   *    either focusDuration or breakDuration depending on what state the session is.
   */
  function findSessionDuration() {
    return (session?.label === "Focusing") ? focusDuration : breakDuration;
  }

  /**
   * Calculates what percent of time has passed since timer began.
   * @returns 
   *    a number betwee 0 and 100 that represents the percentage of time that has elapsed.
   */
  function setProgressBar() {
    const theProgress = ((1 - (session.timeRemaining/(findSessionDuration() * 60) ) ) * 100);
    return theProgress;
  }

  // *** No conditioning in the Return Area ***
  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={() => changeFocus(-5)}
                disabled={session}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={() => changeFocus(5)}
                disable={session}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                {/* Solution is to apply minutesToDuration function to break duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={() => changeBreak(-1)}
                  disabled={session}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={() => changeBreak(1)}
                  disabled={session}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={stopPomodoro}
              disabled={!session}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        {/* Solution: Encase entire section of HTML code within ternary operator on condition of session */}
        {/* This solution was provided with the assistance of a TA */}
        {session ? (
          <>
            <div className="row mb-2">
              <div className="col">
                {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
                <h2 data-testid="session-title">
                  {/* Solution is to apply minutesToDuration function to focusDuration */}
                  {session?.label} for {minutesToDuration(findSessionDuration())} minutes
                </h2>
                {/* TODO: Update message below correctly format the time remaining in the current session */}
                <p className="lead" data-testid="session-sub-title">
                  {/* Solution is to apply secondsToDuration function to session?.timeRemaining */}
                  {secondsToDuration(session?.timeRemaining)} remaining
                </p>
              </div>
            </div>
            {isTimerRunning ? "" : (
              <>
                <h2>PAUSED</h2>
              </>
            )}
            <div className="row mb-2">
              <div className="col">
                <div className="progress" style={{ height: "20px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={setProgressBar()} // TODO: Increase aria-valuenow as elapsed time increases
                    style={{ width: `${setProgressBar()}%` }} // TODO: Increase width % as elapsed time increases
                  />
                </div>
              </div>
            </div>
          </>
        ) : ""} {/*End of Ternary Operator*/}
      </div>
    </div>
  );
}

export default Pomodoro;
