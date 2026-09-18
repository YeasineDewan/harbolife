# Pharmacy E-Commerce Dashboard & Non-LLM AI Engine Documentation

This document explains the architecture, mathematical formulations, and endpoint designs of the predictive analytics (AI) engine built for the admin dashboard. 

The engine uses classical machine learning, statistical modeling, and data mining algorithms written in pure JavaScript (zero external dependencies) to provide insights directly from the transactional database.

---

## Table of Contents
1. [AI/Statistical Algorithms](#1-aistatistical-algorithms)
   - [Linear Regression & Revenue Forecasting](#linear-regression--revenue-forecasting)
   - [K-Means Clustering & Customer Segmentation](#k-means-clustering--customer-segmentation)
   - [Apriori Algorithm & Product Bundles](#apriori-algorithm--product-bundles)
   - [Inventory Runout & Velocity Analytics](#inventory-runout--velocity-analytics)
2. [REST API Endpoints](#2-rest-api-endpoints)
3. [Frontend Integration Guide](#3-frontend-integration-guide)

---

## 1. AI/Statistical Algorithms

### Linear Regression & Revenue Forecasting

#### Overview
This model analyzes the daily revenue history for the past 30 days and projects the revenue trend for the next 7 days.

#### Mathematical Formula
We model daily revenue as a linear function of time:
\[y = mx + c\]
Where:
- \(x\): Day offset (from \(0\) to \(N-1\)).
- \(y\): Revenue on day \(x\).
- \(m\): Trend slope.
- \(c\): Intercept (baseline revenue).

Using the **Least Squares Method**, we calculate:
\[m = \frac{N \sum(xy) - \sum x \sum y}{N \sum(x^2) - (\sum x)^2}\]
\[c = \frac{\sum y - m \sum x}{N}\]

#### Trend Correlation
To understand how strong and steady the revenue direction is, we calculate the **Pearson Correlation Coefficient (\(r\))**:
\[r = \frac{N \sum(xy) - \sum x \sum y}{\sqrt{[N \sum(x^2) - (\sum x)^2][N \sum(y^2) - (\sum y)^2]}}\]

- \(r > 0.6\): Strong Upward Trend (revenue growing steadily).
- \(0.2 < r \le 0.6\): Moderate Upward Trend.
- \(-0.2 \le r \le 0.2\): Stable or Volatile.
- \(-0.6 \le r < -0.2\): Moderate Downward Trend.
- \(r < -0.6\): Strong Downward Trend.

#### Forecasting
For the next 7 days (offsets \(x = N\) to \(x = N+6\)), we compute:
\[y_{forecast}(x) = \max(0, m \cdot x + c)\]
*(Revenue cannot fall below 0)*.

---

### K-Means Clustering & Customer Segmentation

#### Overview
Customer segmentation divides customers into distinct groups using **RFM Analysis** (Recency, Frequency, Monetary).

#### Feature Extraction
For each active customer, the database extracts:
1. **Recency (R):** Number of days since their last order.
2. **Frequency (F):** Total number of completed orders.
3. **Monetary (M):** Total monetary amount spent.

#### Min-Max Normalization
Because monetary values (e.g., $1000) are orders of magnitude larger than frequency (e.g., 5 orders), we scale features to the \([0, 1]\) range to avoid scale dominance:
\[x' = \frac{x - x_{min}}{x_{max} - x_{min}}\]

#### The K-Means Algorithm
1. **Initialize Centroids:** Choose \(K = 3\) starting points randomly from the normalized dataset.
2. **Assignment:** Assign each customer to the nearest centroid using **Euclidean Distance**:
   \[d(p, q) = \sqrt{\sum_{i=1}^3 (p_i - q_i)^2}\]
3. **Update:** Compute the new centroids as the mean of all points assigned to that cluster.
4. **Iterate:** Repeat Assignment and Update steps until centroids no longer shift (or up to 100 iterations).
5. **Denormalization:** Scale centroids back to original units for dashboard display.

#### Dynamic Cluster Labeling
We sort the resulting 3 clusters by their average monetary spend:
- **VIP Customers:** The cluster with the highest average monetary spend.
- **At Risk / Churning:** Of the remaining two clusters, the one with the higher average recency (days inactive).
- **Active / New Buyers:** The remaining cluster (recent orders, moderate/low spend).

---

### Apriori Algorithm & Product Bundles

#### Overview
Mines transactional data to find pairs of products frequently purchased together. This helps the admin identify product bundling and cross-selling opportunities.

#### Rules Generation & Metrics
For product pair \(\{A, B\}\), we calculate:

1. **Support:** How frequently the pair appears across all baskets:
   \[\text{Support}(A \rightarrow B) = \frac{\text{Orders containing } A \text{ and } B}{\text{Total Orders}}\]

2. **Confidence:** How likely a customer who bought \(A\) is to also buy \(B\):
   \[\text{Confidence}(A \rightarrow B) = \frac{\text{Orders containing } A \text{ and } B}{\text{Orders containing } A}\]

3. **Lift:** How much more likely \(B\) is bought when \(A\) is bought, compared to buying \(B\) independently:
   \[\text{Lift}(A \rightarrow B) = \frac{\text{Confidence}(A \rightarrow B)}{\text{Support}(B)}\]

Rules are filtered where \(\text{Support} \ge 0.01\), \(\text{Confidence} \ge 0.1\), and \(\text{Lift} > 1.0\) (indicating a positive relationship). They are sorted by **Lift** descending.

---

### Inventory Runout & Velocity Analytics

#### Overview
Predicts inventory depleting times based on current stock and sales velocity.

#### Calculations
For each active product:
1. **Sales Velocity (daily):**
   \[\text{Velocity} = \frac{\text{Units sold in last 30 days}}{30}\]
2. **Days Remaining:**
   \[\text{Days Remaining} = \frac{\text{Current Stock}}{\text{Velocity}}\]

#### Alerts classification
- **Out of Stock:** Current stock is 0.
- **Immediate Reorder:** \(\text{Days Remaining} \le 7\) days.
- **Warning:** \(7 < \text{Days Remaining} \le 15\) days.
- **Healthy:** \(\text{Days Remaining} > 15\) days (or velocity is 0 with positive stock).

---

## 2. REST API Endpoints

All endpoints are protected by jwt verification and require admin/super_admin roles:
`Authorization: Bearer <cookie_token>`

### 1. General Stats
- **URL:** `/api/dashboard/stats`
- **Method:** `GET`
- **Response Format:**
```json
{
  "status": "success",
  "stats": {
    "totalRevenue": 15430.50,
    "totalOrders": 125,
    "totalProducts": 420,
    "totalUsers": 98,
    "lowStockCount": 14,
    "pendingOrdersCount": 8
  }
}
```

### 2. Revenue & Sales Forecasting
- **URL:** `/api/dashboard/revenue-forecast`
- **Method:** `GET`
- **Response Format:**
```json
{
  "message": "Revenue forecast generated successfully",
  "historical": [
    { "date": "2026-07-28", "revenue": 450.00, "ordersCount": 3 },
    { "date": "2026-07-29", "revenue": 520.00, "ordersCount": 4 }
  ],
  "forecast": [
    { "x": 30, "y": 535.50, "dateStr": "2026-07-30" },
    { "x": 31, "y": 551.20, "dateStr": "2026-07-31" }
  ],
  "trend": {
    "slope": 15.70,
    "intercept": 80.20,
    "correlation": 0.89,
    "trendType": "Strong Upward Trend"
  }
}
```

### 3. Customer Clustering Segments
- **URL:** `/api/dashboard/customer-segments`
- **Method:** `GET`
- **Response Format:**
```json
{
  "message": "Customer segmentation completed successfully",
  "clusters": [
    {
      "index": 0,
      "centroid": { "recency": 2.5, "frequency": 14.8, "monetary": 2340.50 },
      "count": 12,
      "percentage": 15.38,
      "label": "VIP Customers",
      "description": "High value, high frequency, and highly loyal customers."
    }
  ],
  "userAssignments": [
    {
      "userId": "603f9f4a56b8a211bc9170e1",
      "recency": 2,
      "frequency": 15,
      "monetary": 2400.00,
      "clusterIndex": 0,
      "label": "VIP Customers",
      "user": {
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  ]
}
```

### 4. Product Bundles (Apriori rules)
- **URL:** `/api/dashboard/product-bundles`
- **Method:** `GET`
- **Response Format:**
```json
{
  "message": "Product bundles/association rules mined successfully",
  "rules": [
    {
      "antecedent": "603f9f4a56b8a211bc9170e5",
      "consequent": "603f9f4a56b8a211bc9170e6",
      "support": 0.08,
      "confidence": 0.65,
      "lift": 3.25,
      "antecedentProduct": { "name": "Panadol Extra", "price": 15.00 },
      "consequentProduct": { "name": "Vitamin C 1000mg", "price": 25.00 }
    }
  ]
}
```

### 5. Inventory Analysis
- **URL:** `/api/dashboard/inventory-analysis`
- **Method:** `GET`
- **Response Format:**
```json
{
  "message": "Inventory velocity analysis completed successfully",
  "products": [
    {
      "productId": "603f9f4a56b8a211bc9170e5",
      "name": "Panadol Extra",
      "stock": 2,
      "price": 15.00,
      "unitsSoldLast30Days": 90,
      "dailyVelocity": 3.0,
      "daysRemaining": 0.7,
      "status": "Immediate Reorder"
    }
  ]
}
```

---

## 3. Frontend Integration Guide

To render this data into beautiful charts on your frontend:

### Line Chart (Historical + Forecasted Sales)
- Combine the `historical` and `forecast` arrays.
- Use a library like **Recharts** (`<LineChart>`) or **Chart.js**.
- Render the `historical` data in a solid line and the `forecast` data in a dashed line (representing predicted sales).

### Pie / Donut Chart (Customer Segmentation)
- Render the `clusters` array in a pie chart.
- Label colors:
  - **VIP Customers:** Emerald green / purple.
  - **Active / New Buyers:** Soft blue.
  - **At Risk / Churning:** Bright red / amber.

### Table / Matrix (Product Bundles)
- Display the antecedent and consequent products together as "Frequently Bought Together".
- Show the `lift` multiplier to explain *why* they are paired (e.g. "Customers are 3.25x more likely to buy Vitamin C when buying Panadol").

### Status Alerts (Inventory Velocity)
- Display a warning badge next to products with "Immediate Reorder" or "Warning" status.
- Show `daysRemaining` as a visual countdown progress bar.
