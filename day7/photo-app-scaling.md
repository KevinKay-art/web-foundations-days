# SnapShare Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed containing photos from people they follow.

Starting facts:

- Registered users: 10,000,000
- Daily active users: 10% of registered users
- Each active user uploads 1 photo per day
- Each active user views 50 feed pages per day
- Average original photo size: 2 MB
- Thumbnail size: 50 KB
- Assume 1 day is approximately 100,000 seconds
- Assume traffic is spread across the day for average calculations
- Peak traffic is estimated at 5 times the average traffic
- One year is assumed to have 365 days

### Daily active users

10,000,000 × 10% = **1,000,000 daily active users**

## 2. Traffic and storage estimates

### Uploads per second

Daily uploads:

1,000,000 × 1 = **1,000,000 uploads/day**

Average uploads per second:

1,000,000 ÷ 100,000 = **10 uploads/second**

### Feed views per second

Daily feed views:

1,000,000 × 50 = **50,000,000 feed views/day**

Average feed views per second:

50,000,000 ÷ 100,000 = **500 feed views/second**

Peak feed views per second:

500 × 5 = **2,500 feed views/second**

### Photo storage per year

Each photo requires:

- Original photo: 2 MB
- Thumbnail: 50 KB = 0.05 MB
- Total per photo: 2.05 MB

Daily storage:

1,000,000 × 2.05 MB = **2,050,000 MB/day**

This is approximately **2.05 TB/day**.

Yearly storage:

2.05 TB × 365 = **748.25 TB/year**

Therefore, SnapShare needs approximately **748 TB of new photo and thumbnail storage per year**, before backups, replication, and other overhead.

## 3. Read-heavy or write-heavy?

SnapShare is a **read-heavy system**.

There are approximately 10 photo uploads per second but approximately 500 feed views per second on average. Therefore, the system receives many more read requests than photo uploads.

The design should prioritize fast reads using a **CDN, cache, and database read replica**. These reduce the amount of work handled by the app servers and primary database.

## 4. Why photos should not be stored inside the database

Photos should not be stored directly inside the database because large binary files would consume a large amount of database storage and make backups, replication, and database operations more expensive and slower.

Instead, the original photos and thumbnails should be stored in **object storage**. The database should store metadata such as the photo ID, owner, caption, upload time, and object-storage location.

The CDN can then deliver frequently requested photos efficiently to users.

## 5. Architecture diagram

```text
                         Users
                           |
                           v
                          CDN
                           |
                           v
                    Load Balancer
                           |
                           v
                  +------------------+
                  |    App Servers   |
                  |  Server 1        |
                  |  Server 2        |
                  |  Server 3        |
                  +------------------+
                     |     |      |
                     |     |      |
                     v     v      v
                   Cache Database Queue
                  (Redis)  |       |
                           |       v
                           |    +--------+
                           |    | Worker |
                           |    +--------+
                           |       |
                           |       v
                           |  Create thumbnail
                           |       |
                           v       v
                     +-------------------+
                     |   Object Storage  |
                     | Original photos  |
                     | Thumbnails       |
                     +-------------------+
                           |
                           v
                          CDN

                 Database
                 /      \
                /        \
        Primary DB    Read Replica
                         |
                         v
                    Feed reads
```

## 6. What each component solves

- **CDN:** Serves photos, thumbnails, CSS, JavaScript, and other static files from locations close to users, reducing latency and app-server traffic.
- **Load balancer:** Distributes incoming requests across multiple app servers so that one server does not become a bottleneck.
- **App servers:** Run the application logic for uploads, feeds, authentication, and other requests.
- **Cache:** Stores frequently accessed data such as feed information so the application does not need to query the database for every request.
- **Primary database:** Stores durable structured data such as users, follows, photo metadata, captions, and relationships.
- **Read replica:** Handles database read traffic so the primary database can focus more on writes.
- **Object storage:** Stores the large original photo files and thumbnails separately from the database.
- **Queue:** Holds background jobs such as thumbnail-generation tasks so they do not slow down the user's upload request.
- **Worker:** Processes queued jobs and creates thumbnails from uploaded original photos.

## 7. Photo upload flow

1. The user selects a photo and uploads it to SnapShare.
2. The request reaches the load balancer and is routed to an available app server.
3. The app server validates the user and the photo, including file type and size.
4. The original photo is stored in object storage.
5. The app server creates a database record containing the photo metadata and object-storage location.
6. The app server places a thumbnail-generation job on the queue.
7. The server responds to the user that the photo upload was accepted.
8. A worker takes the thumbnail job from the queue.
9. The worker accesses the original photo from object storage.
10. The worker creates the 50 KB thumbnail.
11. The worker stores the thumbnail in object storage.
12. The thumbnail can then be delivered through the CDN when users view the photo in their feeds.

## 8. Trade-offs

### Trade-off 1: Cache speed vs data freshness

Using a cache makes feed reads much faster and reduces database load, but cached data can become stale. The system therefore needs cache expiration or invalidation when important data changes.

### Trade-off 2: Read replica performance vs consistency

A read replica allows SnapShare to handle many more feed reads, but replication can introduce a small delay between the primary database and the replica. A user may therefore briefly see older data after an update.

### Trade-off 3: Asynchronous thumbnails vs immediate availability

Using a queue and worker makes uploads faster because thumbnail generation happens in the background. However, the thumbnail may not be available immediately after the upload because the background job takes time to complete.

### Trade-off 4: Object storage vs database simplicity

Object storage is much better for large photo files and scales more easily, but it introduces another service that the application must manage instead of keeping everything in one database.