import { container } from 'tsyringe';
import { CommonTokenConstants } from './CommonTokenConstants';
import { DekstopMobileConfiguration, PlainPoint } from './Types';

container.register<number>(
    CommonTokenConstants.MOBILE_BORDER_PADDING, 
    { useValue: 10 }
);

container.register<PlainPoint>(
    CommonTokenConstants.AUTOSPIN_PANEL_BUTTON_SPACING, 
    {  useValue: { x:20, y: 25 } }
);

container.register<DekstopMobileConfiguration<PlainPoint>>(
    CommonTokenConstants.AUTOSPIN_PANEL_CHECKBOX_SPACING, 
    { 
        useValue: { 
            mobile: { x: 0, y: 40 }, 
            desktop: { x: 50, y: 10 }
        }
    }
);

container.register<number>(
    CommonTokenConstants.AUTOSPIN_PANEL_MOBILE_MAX_BUTTONS_IN_ROW, 
    { useValue: 4 }
)

container.register<number[]>(
    CommonTokenConstants.AUTOSPIN_PANEL_NUMBER_OF_SPINS,
    { useValue: [10, 30, 50, 80, 1000] }
)

container.register<number>(
    CommonTokenConstants.AUTOSPIN_PANEL_MOBILE_CONTAINER_WIDTH,
    { useValue: 1000 }
)

container.register<number>(
    CommonTokenConstants.CASCADE_HISTORY_CELL_MAX_FONT_SIZE,
    { useValue: 20 }
)

container.register<number>(
    CommonTokenConstants.CASCADE_HISTORY_VIEW_FALLING_TIME,
    { useValue: 0.3 }
)

container.register<number>(
    CommonTokenConstants.CASCADE_HISTORY_VIEW_MAX_ELEMENTS,
    { useValue: 4 }
)

container.register<number>(
    CommonTokenConstants.CASCADE_HISTORY_VIEW_CELL_OFFSET,
    { useValue: 2 }
)

container.register<string[]>(
    CommonTokenConstants.CHECKBOX_OPTION_ALLOWED_CHARS,
    { useValue: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'] }
)

container.register<string>(
    CommonTokenConstants.CHECKBOX_OPTION_FONT,
    { useValue: 'Gilroy' }
)

container.register<string>(
    CommonTokenConstants.CHECKBOX_OPTION_TEXT_COLOR,
    { useValue: '0xffffff' }
)

container.register<DekstopMobileConfiguration<number>>(
    CommonTokenConstants.CHECKBOX_OPTION_FONT_SIZE,
    { useValue: { mobile: 36, desktop: 15 }}
)

container.register<number>(
    CommonTokenConstants.DOUBLE_CHANCE_BUTTON_COST_RATE,
    { useValue: 1.25 }
)

container.register<DekstopMobileConfiguration<PlainPoint>>(
    CommonTokenConstants.PAYTABEL_PANEL_SYMBOL_CELL_SPACING,
    { 
        useValue: { 
            desktop: { x: 60, y: 60 }, 
            mobile: { x: 21, y: 30 }
        } 
    }
)

container.register<number>(
    CommonTokenConstants.PAYTBALE_PANEL_MOBILE_TEXTFIELD_VERTICAL_SPACING,
    { useValue: 50 }
)

container.register<number>(
    CommonTokenConstants.HISTORY_PANEL_DESKTOP_BORDER_PADDING,
    { useValue: 40 }
)

container.register<number>(
    CommonTokenConstants.HISTORY_PANEL_DESKTOP_BACKGROUND_WIDTH,
    { useValue: 1307 }
)
