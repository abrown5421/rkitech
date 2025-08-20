import React from 'react';
import Container from '../../../shared/components/container/Container';
import Select from '../../../shared/components/select/Select';
import type { EntranceAnimation, EntrancExitAnimationPickerProps, ExitAnimation } from './EntrancExitAnimationPickerTypes';

const ENTRANCES = [
  { name: 'Back In Down', value: 'animate__backInDown' },
  { name: 'Back In Left', value: 'animate__backInLeft' },
  { name: 'Back In Right', value: 'animate__backInRight' },
  { name: 'Back In Up', value: 'animate__backInUp' },
  { name: 'Bounce In', value: 'animate__bounceIn' },
  { name: 'Bounce In Down', value: 'animate__bounceInDown' },
  { name: 'Bounce In Left', value: 'animate__bounceInLeft' },
  { name: 'Bounce In Right', value: 'animate__bounceInRight' },
  { name: 'Bounce In Up', value: 'animate__bounceInUp' },
  { name: 'Fade In', value: 'animate__fadeIn' },
  { name: 'Fade In Down', value: 'animate__fadeInDown' },
  { name: 'Fade In Down Big', value: 'animate__fadeInDownBig' },
  { name: 'Fade In Left', value: 'animate__fadeInLeft' },
  { name: 'Fade In Left Big', value: 'animate__fadeInLeftBig' },
  { name: 'Fade In Right', value: 'animate__fadeInRight' },
  { name: 'Fade In Right Big', value: 'animate__fadeInRightBig' },
  { name: 'Fade In Up', value: 'animate__fadeInUp' },
  { name: 'Fade In Up Big', value: 'animate__fadeInUpBig' },
  { name: 'Fade In Top Left', value: 'animate__fadeInTopLeft' },
  { name: 'Fade In Top Right', value: 'animate__fadeInTopRight' },
  { name: 'Fade In Bottom Left', value: 'animate__fadeInBottomLeft' },
  { name: 'Fade In Bottom Right', value: 'animate__fadeInBottomRight' },
  { name: 'Flip In X', value: 'animate__flipInX' },
  { name: 'Flip In Y', value: 'animate__flipInY' },
  { name: 'Light Speed In Right', value: 'animate__lightSpeedInRight' },
  { name: 'Light Speed In Left', value: 'animate__lightSpeedInLeft' },
  { name: 'Rotate In', value: 'animate__rotateIn' },
  { name: 'Rotate In Down Left', value: 'animate__rotateInDownLeft' },
  { name: 'Rotate In Down Right', value: 'animate__rotateInDownRight' },
  { name: 'Rotate In Up Left', value: 'animate__rotateInUpLeft' },
  { name: 'Rotate In Up Right', value: 'animate__rotateInUpRight' },
  { name: 'Roll In', value: 'animate__rollIn' },
  { name: 'Zoom In', value: 'animate__zoomIn' },
  { name: 'Zoom In Down', value: 'animate__zoomInDown' },
  { name: 'Zoom In Left', value: 'animate__zoomInLeft' },
  { name: 'Zoom In Right', value: 'animate__zoomInRight' },
  { name: 'Zoom In Up', value: 'animate__zoomInUp' },
  { name: 'Slide In Down', value: 'animate__slideInDown' },
  { name: 'Slide In Left', value: 'animate__slideInLeft' },
  { name: 'Slide In Right', value: 'animate__slideInRight' },
  { name: 'Slide In Up', value: 'animate__slideInUp' },
];

const EXITS = [
  { name: 'Back Out Down', value: 'animate__backOutDown' },
  { name: 'Back Out Left', value: 'animate__backOutLeft' },
  { name: 'Back Out Right', value: 'animate__backOutRight' },
  { name: 'Back Out Up', value: 'animate__backOutUp' },
  { name: 'Bounce Out', value: 'animate__bounceOut' },
  { name: 'Bounce Out Down', value: 'animate__bounceOutDown' },
  { name: 'Bounce Out Left', value: 'animate__bounceOutLeft' },
  { name: 'Bounce Out Right', value: 'animate__bounceOutRight' },
  { name: 'Bounce Out Up', value: 'animate__bounceOutUp' },
  { name: 'Fade Out', value: 'animate__fadeOut' },
  { name: 'Fade Out Down', value: 'animate__fadeOutDown' },
  { name: 'Fade Out Down Big', value: 'animate__fadeOutDownBig' },
  { name: 'Fade Out Left', value: 'animate__fadeOutLeft' },
  { name: 'Fade Out Left Big', value: 'animate__fadeOutLeftBig' },
  { name: 'Fade Out Right', value: 'animate__fadeOutRight' },
  { name: 'Fade Out Right Big', value: 'animate__fadeOutRightBig' },
  { name: 'Fade Out Up', value: 'animate__fadeOutUp' },
  { name: 'Fade Out Up Big', value: 'animate__fadeOutUpBig' },
  { name: 'Fade Out Top Left', value: 'animate__fadeOutTopLeft' },
  { name: 'Fade Out Top Right', value: 'animate__fadeOutTopRight' },
  { name: 'Fade Out Bottom Left', value: 'animate__fadeOutBottomLeft' },
  { name: 'Fade Out Bottom Right', value: 'animate__fadeOutBottomRight' },
  { name: 'Flip Out X', value: 'animate__flipOutX' },
  { name: 'Flip Out Y', value: 'animate__flipOutY' },
  { name: 'Light Speed Out Right', value: 'animate__lightSpeedOutRight' },
  { name: 'Light Speed Out Left', value: 'animate__lightSpeedOutLeft' },
  { name: 'Rotate Out', value: 'animate__rotateOut' },
  { name: 'Rotate Out Down Left', value: 'animate__rotateOutDownLeft' },
  { name: 'Rotate Out Down Right', value: 'animate__rotateOutDownRight' },
  { name: 'Rotate Out Up Left', value: 'animate__rotateOutUpLeft' },
  { name: 'Rotate Out Up Right', value: 'animate__rotateOutUpRight' },
  { name: 'Roll Out', value: 'animate__rollOut' },
  { name: 'Zoom Out', value: 'animate__zoomOut' },
  { name: 'Zoom Out Down', value: 'animate__zoomOutDown' },
  { name: 'Zoom Out Left', value: 'animate__zoomOutLeft' },
  { name: 'Zoom Out Right', value: 'animate__zoomOutRight' },
  { name: 'Zoom Out Up', value: 'animate__zoomOutUp' },
  { name: 'Slide Out Down', value: 'animate__slideOutDown' },
  { name: 'Slide Out Left', value: 'animate__slideOutLeft' },
  { name: 'Slide Out Right', value: 'animate__slideOutRight' },
  { name: 'Slide Out Up', value: 'animate__slideOutUp' },
];

const EntrancExitAnimationPicker: React.FC<EntrancExitAnimationPickerProps> = ({
    entranceValue,
    exitValue,
    onEntranceChange,
    onExitChange
}) => {

    return (
        <Container TwClassName='flex-row gap-2'>
            <Select
                TwClassName='flex-1 justify-center items-center'
                label="Entrance"
                value={entranceValue}
                onChange={(e) => onEntranceChange(e.target.value as EntranceAnimation)}
            >
                {ENTRANCES.map(ent => (
                    <option key={ent.value} value={ent.value}>{ent.name}</option>
                ))}
            </Select>
            <Select
                TwClassName='flex-1 justify-center items-center'
                label="Exit"
                value={exitValue}
                onChange={(e) => onExitChange(e.target.value as ExitAnimation)}
            >
                {EXITS.map(ext => (
                    <option key={ext.value} value={ext.value}>{ext.name}</option>
                ))}
            </Select>
        </Container>
    );
};

export default EntrancExitAnimationPicker;
