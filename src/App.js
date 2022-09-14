import {useEffect, useState} from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import axios from "axios";
import './App.css'

export default function App() {
    const [boardLink, setBoardLink] = useState('');

    useEffect(() => {
        setBoardLink('');
    }, []);

    // needed to auto forward to new URL
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const API_ENDPOINT = "https://backend-hpistudios-exercise.herokuapp.com";

    // expects http://localhost:3000/?exercise=1
    const sendBoardCreationBackendRequest = () => {
        let exerciseId = params.get('exercise');
        axios.get(`${API_ENDPOINT}/setupExercise?exerciseId=${exerciseId}`)
            .then((response) => {
                // if board was cloned forward to link of board in browser
                let receivedLink = response.data.viewLink
                setBoardLink(receivedLink);
                window.location.href = receivedLink;
            })
            .catch((error) => {
                if (error.response) {
                    window.alert("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.\n" +
                        `Error Message: ${error.message} - ${error.code}`);
                } else {
                    // lead to alert window on firefox in case of successfull request
                    if (error.message !== 'Request aborted') {
                        window.alert("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
                    }
                }
            })
    };

    if (params.get('exercise') === undefined) {
        // if link is only http://localhost:3000/
        window.alert('Bitte Übung in URL angeben');
    } else {
        // disable this to manually click "create new board" Button (good for debugging)
        // sendBoardCreationBackendRequest();
    }

    document.body.style = 'background: #191919';

    return (
        <div>
            <div
                className="background_table_setup"
            >
                <div
                    className="table_cell"
                >
                    <div
                        className="horizontal_center"
                    >
                        {
                            <div>
                                <div>
                                    {/*if no link to forward to is available show that it's loading,
                                     else show a manual click to forward link*/}
                                    {boardLink === '' ? (
                                        <div>
                                            <p style={{textAlign: 'center'}}>
                                                Wir bereiten deine Übung für dich vor
                                            </p>
                                            <div
                                                className="loader"
                                            >
                                                <PulseLoader
                                                    loading={true}
                                                    size={10}
                                                    color={'#FFFFFF'}
                                                    speedMultiplier={0.5}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <a
                                            href={boardLink}
                                            className="boardLink"
                                        >
                                            {' '}
                                            Öffne hier dein Board!{' '}
                                        </a>
                                    )}
                                </div>
                                <button
                                    className="button"
                                    onClick={sendBoardCreationBackendRequest}
                                >
                                    Neues Board erstellen
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
