import katex from 'katex';
import React from 'react';

class KaTexOutput extends React.Component {

  _update() {
    katex.render(
      this.props.content,
      this.refs.container,
      {displayMode: true},
    );
  }

  componentDidMount() {
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.content !== this.props.content) {
      this._update();
    }
  }

  render() {
    return <div ref="container" onClick={this.props.onClick} />;
  }
}

class TeXBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false};

    this._onClick = () => {
      if (this.state.editMode) {
        return;
      }

      this.setState({
        editMode: true,
        texValue: this._getValue(),
      }, () => {
        this._startEdit();
      });
    };

    this._onValueChange = evt => {
      const value = evt.target.value;
      let invalid = false;
      try {
        katex.__parse(value);
      } catch (e) {
        invalid = true;
      } finally {
        this.setState({
          invalidTeX: invalid,
          texValue: value,
        });
      }
    };

    this._save = () => {
      const entityKey = this.props.block.getEntityAt(0);
      const newContentState = this.props.contentState.mergeEntityData(
          entityKey,
          {content: this.state.texValue},
      );
      this.setState({
        invalidTeX: false,
        editMode: false,
        texValue: null,
      }, this._finishEdit.bind(this, newContentState));
    };

    this._remove = () => {
      this.props.blockProps.onRemove(this.props.block.getKey());
    };
    this._startEdit = () => {
      this.props.blockProps.onStartEdit(this.props.block.getKey());
    };
    this._finishEdit = (newContentState) => {
      this.props.blockProps.onFinishEdit(
        this.props.block.getKey(),
        newContentState,
      );
    };
  }

  _getValue() {
    return this.props.contentState
      .getEntity(this.props.block.getEntityAt(0))
      .getData()['content'];
  }

  render() {
    let texContent = null;
    if (this.state.editMode) {
      if (this.state.invalidTeX) {
        texContent = '';
      } else {
        texContent = this.state.texValue;
      }
    } else {
      texContent = this._getValue();
    }

    let className = 'TeXEditor-tex';
    if (this.state.editMode) {
      className += ' TeXEditor-activeTeX';
    }

    let editPanel = null;
    if (this.state.editMode) {
      let buttonClass = 'TeXEditor-saveButton';
      if (this.state.invalidTeX) {
        buttonClass += ' TeXEditor-invalidButton';
      }

      editPanel =
        <div className="TeXEditor-panel">
          <textarea
            className="TeXEditor-texValue"
            onChange={this._onValueChange}
            ref="textarea"
            value={this.state.texValue}
          />
          <div className="TeXEditor-buttons">
            <button
              className={buttonClass}
              disabled={this.state.invalidTeX}
              onClick={this._save}>
              {this.state.invalidTeX ? 'Invalid TeX' : 'Done'}
            </button>
            <button className="TeXEditor-removeButton" onClick={this._remove}>
              Remove
            </button>
          </div>
        </div>;
    }

    return (
      <div className={className}>
        <KaTexOutput content={texContent} onClick={this._onClick} />
        {editPanel}
      </div>
    );
  }
}

export default TeXBlock
