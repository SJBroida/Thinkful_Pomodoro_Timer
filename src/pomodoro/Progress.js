import React from "react";
import { minutesToDuration } from "../utils/duration";
import { secondsToDuration } from "../utils/duration";

function Progress({isTimerRunning, session, focusDuration, breakDuration}) {

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

    return (
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
    );
}

export default Progress;