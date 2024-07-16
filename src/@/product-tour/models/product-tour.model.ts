import { createEvent, createStore, } from 'effector';

import { setPayload } from '~/lib/effector-kit';


export const onChangeTourStartPopup = createEvent<boolean>();
export const $tourStartPopup = createStore(false)
$tourStartPopup.on(onChangeTourStartPopup, setPayload);

export const onChangeTourEndPopup = createEvent<boolean>();
export const $tourEndPopup = createStore(false)
$tourEndPopup.on(onChangeTourEndPopup, setPayload);

export const onChangeTourStarted = createEvent<boolean>();
export const $tourStarted = createStore(false)
$tourStarted.on(onChangeTourStarted, setPayload);

export const onChangeCurrentMainStep = createEvent<number>();
export const $currentMainStep = createStore(0)
$currentMainStep.on(onChangeCurrentMainStep, setPayload);


export const onChangeCurrentSubStep = createEvent<number>();
export const $currentSubStep = createStore(0)
$currentSubStep.on(onChangeCurrentSubStep, setPayload);