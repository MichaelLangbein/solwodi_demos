import {color} from 'd3-color';


export const color1 = color(getComputedStyle(document.documentElement).getPropertyValue('--color1'));
export const color2 = color(getComputedStyle(document.documentElement).getPropertyValue('--color2'));
export const color3 = color(getComputedStyle(document.documentElement).getPropertyValue('--color3'));
export const color4 = color(getComputedStyle(document.documentElement).getPropertyValue('--color4'));
export const color5 = color(getComputedStyle(document.documentElement).getPropertyValue('--color5'));
export const gray1 = color(getComputedStyle(document.documentElement).getPropertyValue('--gray1'));
export const gray2 = color(getComputedStyle(document.documentElement).getPropertyValue('--gray2'));
export const gray3 = color(getComputedStyle(document.documentElement).getPropertyValue('--gray3'));
export const gray4 = color(getComputedStyle(document.documentElement).getPropertyValue('--gray4'));
export const gray5 = color(getComputedStyle(document.documentElement).getPropertyValue('--gray5'));


export const color1Rgb = [color1.r, color1.g, color1.b];
export const color2Rgb = [color2.r, color2.g, color2.b];
export const color3Rgb = [color3.r, color3.g, color3.b];
export const color4Rgb = [color4.r, color4.g, color4.b];
export const color5Rgb = [color5.r, color5.g, color5.b];
export const gray1Rgb = [gray1.r, gray1.g, gray1.b];
export const gray2Rgb = [gray2.r, gray2.g, gray2.b];
export const gray3Rgb = [gray3.r, gray3.g, gray3.b];
export const gray4Rgb = [gray4.r, gray4.g, gray4.b];
export const gray5Rgb = [gray5.r, gray5.g, gray5.b];


export const color1Hex = color1.formatHex();
export const color2Hex = color2.formatHex();
export const color3Hex = color3.formatHex();
export const color4Hex = color4.formatHex();
export const color5Hex = color5.formatHex();
export const gray1Hex = gray1.formatHex();
export const gray2Hex = gray2.formatHex();
export const gray3Hex = gray3.formatHex();
export const gray4Hex = gray4.formatHex();
export const gray5Hex = gray5.formatHex();
