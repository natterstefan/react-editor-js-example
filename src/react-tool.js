import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid'

const ReactComponent = ({ className, text }) => {
  useEffect(() => console.log('ReactComponent mounted ✌🏻'), [])
  return (
    <div className={className}>
      <h3>React Component</h3>
      {text}
    </div>
  )
}

/**
 * ReactTool renders the ReactComponent and provides a bridge between the
 * EditorJs and the ReactComponent.
 *
 * Docs
 * @see https://editorjs.io/tools-api
 */
export default class ReactTool {
  constructor({ data, api, config }) {
    // provided by EditorJS
    this.api = api
    this.config = config
    this.data = data

    // UI element rendered by the plugin/tool
    this.container = undefined

    // use the same css classes (wherever possible) like EditorJS to stay in
    // sync with the standard UI. CSS classes can be found here:
    // @see https://github.com/codex-team/editor.js/blob/v2.17/src/components/modules/api/styles.ts
    this._CSS = {
      block: this.api.styles.block,
      react: 'react-component',
    }

    /**
     * When communicating (with CustomEvents) with the ReactComponent a unique blockId can be super helpful.
     *
     */
    this.blockId = uuidv4()
  }

  render() {
    // ATTENTION: do not create the element twice!
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.classList.add(this._CSS.block)

      ReactDOM.render(
        <ReactComponent
          {...this.data}
          className={this._CSS.react}
          blockId={this.blockId}
        />,
        this.container,
      )
    }
    return this.container
  }

  /**
   * LIFECYCLE HOOKS
   * @see https://editorjs.io/tools-api#lifecycle-hooks
   */
  rendered() {
    console.log('ReactTool was rendered')
  }

  moved() {
    console.log('ReactTool was moved')
  }

  removed() {
    console.log('ReactTool was removed')
    /* removes the react component from the DOM */
    ReactDOM.unmountComponentAtNode(this.container)
  }

  /**
   * invoked by editorjs and should return current data of the block
   */
  save(element) {
    return {
      text: element.innerText,
    }
  }
}
