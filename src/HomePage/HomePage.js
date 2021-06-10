import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { appActions, alertActions, progressActions } from '../_actions';
import { history, rtnStatsName } from '../_helpers';
import { TopNavbar } from '../_components';
import config from '../_configs/configs.json';

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.authentication.user);
    const progressItems = useSelector(state => state.progress.items);

    const [ challenges, setChallenges ] = useState();
    const [ challengeListJSX, setChallengeListJSX ] = useState(<h3 className="text-white">Loading challenge list..</h3>);

    const selectChallengeGo = (challengeItem) => {
        dispatch(appActions.setTrainingDataSet(challengeItem.dataSetName));
        history.push('/trainer');
    };

    const fetchChallengeList = function() {
        return fetch(
            `../data/challenges.json`,
            {method: "GET"}
        ).then((response) => response.text())
        .then((data) => {
            // console.log(JSON.parse(data));
            setChallenges(JSON.parse(data));
        })
        .catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        fetchChallengeList();
        dispatch(progressActions.fetchAllProgress(user.id));

        setTimeout(() => {
            dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
    }, [])

    useEffect(() => {
        if (challenges !== undefined && progressItems !== undefined) {
            setChallengeListJSX( challenges.items.map((item, index) => {
                const statsName = rtnStatsName(user.id, item.dataSetName);
                const progressMatch = progressItems.length > 0 ? progressItems.filter(progressItem => progressItem.statsName === statsName) : [];  // check if any progress item from server matches the challenge item
                const progress = progressMatch.length === 1 ? parseFloat(progressMatch[0].progress * 100) : 0.0;
                const gain = progressMatch.length === 1 ? parseFloat(progressMatch[0].gain * 100) : 0.0;

                return (
                    <>
                        <a onClick={() => selectChallengeGo(item)} href="#" className="list-group-item list-group-item-action flex-column align-items-start" data-tip data-for={item.dataSetName}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{item.dataSetName}</h5>
                                <small>{item.era}</small>
                            </div>
                            <p className="mb-1">{item.shortDescription}</p>
                            <ProgressBar animated variant="success" now={progress} />
                        </a>
                        <ReactTooltip key={index} className="description-tooltip" id={item.dataSetName} effect='solid' backgroundColor='#353535FF'>
                            <div>{item.description}</div>
                            <div><b>Your Progress: {`${progress.toFixed(2)}%`} Portfolio Performance: {`${gain.toFixed(2)}%`}</b></div>
                        </ReactTooltip>
                    </>
    
                    // <a key={index} onClick={() => selectChallengeGo(item)} href="#" className="list-group-item list-group-item-action flex-column align-items-start" data-toggle="tooltip" title={item.description}>
                    //     <div className="d-flex w-100 justify-content-between">
                    //         <h5 className="mb-1">{item.dataSetName}</h5>
                    //         <small>{item.era}</small>
                    //     </div>
                    //     <p className="mb-1">{item.shortDescription}</p>
                    // </a>
                );
            }));
        }
    }, [challenges, progressItems])


    return (
        <>
            <TopNavbar />
            <div className="col-lg-8 offset-lg-3 verticalUpper widthWide">
                <h1 className="text-white">Welcome to Test-Ware, {user.username}!</h1>
                <br />
                <h4 className="text-white">Select your challenge to begin:</h4>
                <br />
                <div className="list-group">
                    { challengeListJSX }
                </div>
                
            </div>
        </>
    );
}

export { HomePage };