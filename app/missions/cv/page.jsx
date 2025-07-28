'use client';
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Typewriter from "@/components/animations/typewriter";
import Success from "@/components/mission-components/success-animation/success";

const CVMission = () => {
    const [inputValue, setInputValue] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [complete, setComplete] = useState(false);

    const handleSubmit = (inputValue) => {
        if (inputValue === 'Snowboarding36') {
            setComplete(true);
        }
        setInputValue(prev => [...prev, inputValue]);
    }

    const DisplayedText = ({input}) => {
        if(input === '--help') {
            return (<div>
                    <p>Commands:</p>
                    <p>--previous: show previous password</p>
                    <p>--prompt: show secret prompt</p>
                    <p>--age: show password age</p>
                    <p>--previous-prompt: Show the prompt for the previous password</p>
                    <p>--required: Show password requirements</p>
                </div>)
        }
        if (input === '--previous') {
            return <p>Previous Password: Pizza36</p>;
        }
        if (input === '--prompt') {
            return <p>Prompt: Favourite sport and age?</p>;
        }
        if (input === '--age') {
            return <p>Age: current password age 2 years</p>;
        }
        if (input === '--previous-prompt') {
            return <p>Previous Prompt: Favourite food and age?</p>;
        }
        if (input === '--required') {
            return <p>Requirements: 6 characters min, 1 uppercase min, 1 number min</p>;
        }
        if (typeof input === 'string') {
            input = input.split('');
        }
        return (
            <p>
                {input.map((text, index) => {
                    const getColor = (input, index) => {
                        const password = 'Snowboarding36';
                        if (index < password.length) {
                            return input[index] === password[index] ? 'green' : 'red';
                        }
                        return undefined;
                    };
                    return <span key={index} style={{ color: getColor(input, index) }}>{text}</span>;
                })}
            </p>
        )
    }


    return (
        <main className={'main-offset'}>
            {complete && <Success page='/cv'></Success>}
            <div className={styles.screenContainer}>
                <div className={styles.screen}>
                    <p>Please enter password.... error, this terminal is vulnerable type --help to fix issues,</p>
                    <p>Enter Password:</p>
                    {inputValue.map((text, index) => {
                        return <DisplayedText key={index} input={text} />
                    })}
                </div>
            </div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    value={currentInput}
                    onChange={e => setCurrentInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleSubmit(currentInput);
                            setCurrentInput('');
                        }
                    }}
                />
                <button
                    onClick={() => {
                        handleSubmit(currentInput);
                        setCurrentInput('');
                    }}
                >
                    Submit
                </button>
            </div>
        </main>
    );
};

export default CVMission;