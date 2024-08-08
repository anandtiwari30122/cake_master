import { UpdateLayoutDescription } from './UpdateLayoutDescription';

export default interface IAdjustableLayout {
    updateLayout(desc: UpdateLayoutDescription): void;
}
