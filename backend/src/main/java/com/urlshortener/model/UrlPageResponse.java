package com.urlshortener.model;

import java.util.List;

public class UrlPageResponse {
    private List<UrlListItem> items;
    private long totalCount;
    private int page;
    private int size;

    public UrlPageResponse() {
    }

    public UrlPageResponse(List<UrlListItem> items, long totalCount, int page, int size) {
        this.items = items;
        this.totalCount = totalCount;
        this.page = page;
        this.size = size;
    }

    public List<UrlListItem> getItems() {
        return items;
    }

    public void setItems(List<UrlListItem> items) {
        this.items = items;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}

