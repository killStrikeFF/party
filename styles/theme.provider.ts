import {
  createTheme,
  lightColors,
} from '@rneui/themed';
import {
  borderRadiusL,
  mainBg,
  mainBlack,
  mainGreen,
  mainGreyOutline,
  mainWhite,
  orangeBlur,
  primaryColor,
  sizing05,
  sizing125,
  spacingL,
  spacingM,
  spacingS,
  spacingXl,
  spacingXs,
} from './style.variables';

export const themeProviderParty = createTheme({
  mode: 'light',
  lightColors: {
    ...lightColors,
    primary: primaryColor,
    secondary: orangeBlur,
    background: mainBg,
    white: mainWhite,
    black: mainBlack,
    greyOutline: mainGreyOutline,
    success: mainGreen,
    divider: mainGreyOutline,
  },
  components: {
    // Button
    Button: (props) => {
      if (props.isIconButton) {
        return {
          buttonStyle: {
            paddingHorizontal: sizing05,
            paddingVertical: sizing05,
            borderRadius: borderRadiusL,
          },
        };
      }

      return {
        buttonStyle: {
          borderRadius: borderRadiusL,
          paddingHorizontal: sizing125,
          paddingVertical: spacingL,
        },
      };
    },
    // Input
    Input: {
      containerStyle: {
        paddingHorizontal: 0,
      },
      inputStyle: {
        minHeight: 20,
      },
      inputContainerStyle: {
        borderWidth: 1,
        borderRadius: borderRadiusL,
        borderColor: mainGreyOutline,
        padding: spacingL,
      },
      placeholderTextColor: mainGreyOutline,
      errorStyle: {
        display: 'none',
      },
      labelStyle: {
        display: 'none',
      },
    },
    // Divider
    Divider: {
      color: mainGreyOutline,
      orientation: 'horizontal',
    },
  },
  spacing: {
    xs: spacingXs,
    sm: spacingS,
    md: spacingM,
    lg: spacingL,
    xl: spacingXl,
  },
});
