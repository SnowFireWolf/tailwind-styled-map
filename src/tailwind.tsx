import React, { useContext } from 'react';

import elementsArray from './elementTags';
type IntrinsicElementsKeys = keyof JSX.IntrinsicElements


import { CSSModuleClasses, TailwindStyledMapContext } from './Provider';




// convert tailwind class name to css module class name
const convertToClassName = (styledmap: Array<string>, tailwind: CSSModuleClasses) => {
  let classList = '';

  styledmap?.forEach((item, index) => {
    if (index !== styledmap.length - 1) {
      classList += `${tailwind[item]} `;
    } else {
      classList += tailwind[item];
    }
    // console.log('item', tw[item]);
  });

  return classList;
}



// process styled map then return class name
const processStyledMap = (classList: string, sxProps: Array<string>, tailwind: CSSModuleClasses): string => {
  const sxStyledList = convertToClassName(sxProps, tailwind);
  // console.log('sxProps', sxProps);
  // console.log('sxStyledList', sxStyledList);

  return classList && sxStyledList
    ? `${classList} ${sxStyledList}`
    : classList || sxStyledList || '';
}



// merge class name
const mergeOldClass = (oldClass: string, newClass: string | null): string | null => {
  const oldClassString = oldClass ? oldClass : null;
  const newClassString = newClass ? newClass : null;

  // console.log('oldClassString', oldClassString);
  // console.log('newClassString', newClassString);

  return oldClassString ? `${oldClassString} ${newClassString}` : newClassString;
}




const processAll = ({ props, styledmap, tailwind }: { props: any, styledmap?: Array<string>, tailwind: CSSModuleClasses }) => {
  const classList = styledmap ? convertToClassName(styledmap, tailwind) : '';

  // merge with sx
  const clacSxAndClassListResult = processStyledMap(classList, props?.sx, tailwind);

  const newProps = {
    ...props,
    // sx: null,
    className: mergeOldClass(props.className, clacSxAndClassListResult ? clacSxAndClassListResult : null),
  }
  return newProps;
}




const createStyled = (tag: string, styledmap?: Array<string>) => {
  // console.log('styledmap', styledmap);
  const FinalTag = tag;
  // const FinalElement = Element

  // console.log('result classList', classList);

  const TailwindComponent = React.forwardRef<any, any>((props, ref) => {
    const { tailwind } = useContext(TailwindStyledMapContext);

    if (tailwind) {
      // console.log(tailwind);
      const processAllPropsResult = processAll({ props, styledmap, tailwind });
      // console.log('processAllPropsResult', processAllPropsResult);

      return (
        <FinalTag
          {...processAllPropsResult}
          ref={ref}
          // remove old sx props
          sx={null}
        />
      )
    } else {
      console.error(`You need to import TailwindCssModuleContext to use styled-map.`);
      console.error(`More info please vist: https://xxxxxx`);
      throw 'TailwindCssModuleProvider is not found';
    }
  });

  // This enables the react tree to show a name in devtools, much better debugging experience Note: Far from perfect, better implementations welcome
  if (typeof Element !== "string") {
    TailwindComponent.displayName = (Element as any).displayName || (Element as any).name || "tw.Component"
  } else {
    TailwindComponent.displayName = "tw." + Element
  }

  return TailwindComponent;
}



export type tagFunctionsMap = {
  [key in IntrinsicElementsKeys]: (styledmap?: Array<string>) => any
}



const tagFunctions: tagFunctionsMap = elementsArray.reduce((acc, item) => ({
  ...acc,
  [item]: (styledMap: Array<string>) => {
    return createStyled(item, styledMap)
  },
}), {} as any);
// console.log('tagFunctions', tagFunctions);



// merge
const styleTailwind = Object.assign(createStyled, tagFunctions);


 
export default styleTailwind;