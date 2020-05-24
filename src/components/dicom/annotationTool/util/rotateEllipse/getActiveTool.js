import cornerstoneTools from 'cornerstone-tools'
const { getters, state } = cornerstoneTools.store
const BaseAnnotationTool = cornerstoneTools.import('base/baseAnnotationTool')
const BaseBrushTool = cornerstoneTools.import('base/BaseBrushTool')

const getActiveToolsForElement = (
  element,
  tools,
  handlerType = undefined,
) => {
  return tools.filter(
    (tool) =>
      tool.element === element &&
      tool.mode === 'active' &&
      (handlerType === undefined || tool.options[`is${handlerType}Active`]),
  )
}

const filterToolsUseableWithMultiPartTools = (tools) => {
  return tools.filter(
    (tool) =>
      !tool.isMultiPartTool &&
      !(tool instanceof BaseAnnotationTool) &&
      !(tool instanceof BaseBrushTool),
  )
}

export default function getActiveTool(
  element,
  buttons,
  interactionType = 'mouse',
) {
  let tools

  if (interactionType === 'touch') {
    tools = getActiveToolsForElement(element, getters.touchTools())
    tools = tools.filter((tool) => tool.options.isTouchActive)
  } else {
    // Filter out disabled, enabled, and passive
    tools = getActiveToolsForElement(element, getters.mouseTools())

    // Filter out tools that do not match mouseButtonMask
    tools = tools.filter(
      (tool) =>
        Array.isArray(tool.options.mouseButtonMask) &&
        buttons &&
        tool.options.mouseButtonMask.includes(buttons) &&
        tool.options.isMouseActive,
    )

    if (state.isMultiPartToolActive) {
      tools = filterToolsUseableWithMultiPartTools(tools)
    }
  }

  if (tools.length === 0) {
    return
  }

  return tools[0]
}
