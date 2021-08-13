import { CharacterMetadata, ContentState } from "draft-js";
import React from "react";

const styles = {
  immutable: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "2px 0",
    cursor: "pointer"
  }
};

export function getEntityStrategy(mutability: string) {
  // @ts-expect-error ts-migrate(7006)
  // FIXME: Parameter 'contentBlock' implicitly has an 'any' t...
  //  Remove this comment to see the full error message
  return function anonymous(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character: CharacterMetadata) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };
}

function getDecoratedStyle(mutability: string) {
  switch (mutability) {
    case "IMMUTABLE":
      return styles.immutable;
    default:
      return null;
  }
}

type TokenSpanProps = {
  contentState: ContentState;
  entityKey: string;
  offsetKey: string;
};

export const TokenSpan: React.FC<TokenSpanProps> = ({
  contentState,
  entityKey,
  offsetKey,
  children
}) => {
  const style = getDecoratedStyle(
    contentState.getEntity(entityKey).getMutability()
  );

  const text = contentState.getEntity(entityKey).getData().value;

  return (
    <span>
      <sup>
        <cite
          data-offset-key={offsetKey}
          // TODO
          // @ts-ignore
          style={style}
          id={`Popover-${entityKey}`}
        >
          {children}
        </cite>
      </sup>
      {/* TODO tooltip */}
    </span>
  );
};
