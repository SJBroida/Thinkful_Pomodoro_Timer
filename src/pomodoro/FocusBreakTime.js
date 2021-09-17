import React from "react";
import { minutesToDuration } from "../utils/duration"

function FocusBreakTime({
    session, 
    focusDuration,
    setFocusDuration, 
    breakDuration,
    setBreakDuration }) {

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

    return (
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
                            disabled={session}
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
        </div> // End of Div tag; class name "Row"
    ); // End of Return statement

} // End of Focus Break Time Function

export default FocusBreakTime;