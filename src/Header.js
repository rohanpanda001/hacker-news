import React from "react";
import { Pagination, Dropdown, Menu, Button } from "antd";
import { Typography, CircularProgress } from "@material-ui/core";

const SORT_OPTIONS = [
  { title: "Title", key: "title" },
  { title: "Score", key: "score" },
  { title: "Author", key: "by" },
  { title: "Date Published", key: "time" }
];

export default function Header({
  loading,
  sortOrder,
  sortBy,
  onPageChange,
  onSort,
  onSortOrderChange,
  totalLength = 500
}) {
  const sortMenu = (
    <Menu>
      {SORT_OPTIONS.map(sort => (
        <Menu.Item key={sort.key} onClick={() => onSort(sort.key)}>
          {sort.title}
        </Menu.Item>
      ))}
    </Menu>
  );
  const sortOrderMenu = (
    <Menu onClick={onSortOrderChange}>
      <Menu.Item key="asc">ASC</Menu.Item>
      <Menu.Item key="desc">DESC</Menu.Item>
    </Menu>
  );
  return (
    <div style={{ display: "flex", marginBottom: 10 }}>
      <div style={{ flex: 1, display: "flex" }}>
        <Typography variant="h3" style={{ marginRight: 10 }}>
          Hacker News
        </Typography>
        {loading && (
          <CircularProgress size={20} style={{ alignSelf: "center" }} />
        )}
      </div>
      <div style={{ marginRight: 10, alignSelf: "center" }}>
        <span style={{ paddingRight: 10 }}>Sort By</span>
        <Dropdown overlay={sortMenu} placement="bottomCenter">
          <Button type="primary">{sortBy}</Button>
        </Dropdown>
        <Dropdown overlay={sortOrderMenu} placement="bottomCenter">
          <Button type="primary" style={{ marginLeft: 10, marginRight: 10 }}>
            {sortOrder}
          </Button>
        </Dropdown>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Pagination
          defaultCurrent={1}
          total={totalLength}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
