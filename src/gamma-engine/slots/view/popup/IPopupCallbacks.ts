export default interface IPopupCallbacks {
    onPopupShown?: () => void;
    onPopupBeforeHide?: () => void;
    onPopupHidden?: () => void;
}
