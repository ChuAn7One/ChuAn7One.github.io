---
title: "Radar Station"
excerpt: "Multi-sensor perception and robot tracking for RoboMaster's central decision-making system."
---

I designed the perception pipeline for a RoboMaster Radar Station, which supplies a central decision-making system with information about robots in the arena. The system combines a monocular camera with LiDAR so that visual detections can be associated with spatial measurements.

The pipeline uses three-stage target detection to obtain candidate robot observations and ray-based detection to associate them with LiDAR measurements. It turns these observations into tracks that can be updated across frames. Each track provides a robot class and an estimated position to the decision-making system.
