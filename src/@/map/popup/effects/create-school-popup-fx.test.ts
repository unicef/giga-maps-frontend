import { createLoadingPopupFx } from './create-school-popup-fx';

describe('createLoadingPopupFx', () => {
  const map = {} as any;

  it('should return early if map or schoolPopupInfo not provided', async () => {
    let result = await createLoadingPopupFx({ map: null, schoolPopupInfo: { id: "1", geopoint: { coordinates: [10, 20] } } });
    expect(result).toBeUndefined();

    result = await createLoadingPopupFx({ map, schoolPopupInfo: null });
    expect(result).toBeUndefined();
  });

  // it('should create popup, set content and add to map', async () => {
  //   // update jest body dom
  //   document.body.innerHTML = `<div class="popup-template-loading"></div>`
  //   await createLoadingPopupFx({ map, schoolPopupInfo: { id: "1", geopoint: { coordinates: [10, 20] } } });
  // });
});
