import React from "react";
import { Pagination, Dropdown, Menu, Button, Input } from "antd";
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
  pageLimit,
  setPageLimit,
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
    <div>
      <div
        style={{
          display: "flex",
          marginBottom: 10,
          marginTop: 10,
          justifyContent: "flex-end"
        }}
      >
        <div style={{ display: "flex" }}>
          <span style={{ alignSelf: "center" }}>Showing</span>
          <Input
            value={pageLimit}
            onChange={e => {
              const value = e.target.value;
              setPageLimit(value ? parseInt(value) : value);
            }}
            style={{ width: 50, marginLeft: 10, marginRight: 10 }}
          />
          <span style={{ alignSelf: "center" }}>articles</span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
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
    </div>
  );
}
