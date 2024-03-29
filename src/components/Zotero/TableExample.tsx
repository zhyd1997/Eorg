import React from "react";

interface DataType {
  key: string;
  creatorSummary: string;
  parsedDate: string;
  title: string;
}

type TableExampleProps = {
  fetchText: DataType[];
  handleClick: (evt: any) => null;
};

const TableExample = ({ fetchText, handleClick }: TableExampleProps) => {
  let i = 0;

  return (
    <table className="cite-modal-table">
      <thead>
        <tr>
          <th key="author">Author</th>
          <th key="title">Title</th>
          <th key="date">Date</th>
        </tr>
      </thead>
      {/* eslint-disable-next-line max-len */}
      <tbody onClick={handleClick}>
        {/* eslint-disable-next-line no-return-assign */}
        {fetchText.map((data) => (
          <tr data-cite={(i += 1)} key={data.key}>
            <td data-cite={i} key={`${data.key}author`}>
              {data.creatorSummary}
            </td>
            <td data-cite={i} key={`${data.key}title`}>
              {data.title}
            </td>
            <td data-cite={i} key={`${data.key}date`}>
              {data.parsedDate}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableExample;
