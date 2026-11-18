---
title: "Auto Aim"
excerpt: "Extended Kalman filter tracking of RoboMaster armor plates using a whole-robot motion model."
---

I worked on Auto Aim for RoboMaster, where the tracking task is to estimate the trajectory of armor plates mounted on a moving competition robot. The system uses an extended Kalman filter (EKF) to estimate the motion of the robot as a whole from individual plate observations.

The whole-robot model relates the motion of the plates to a common robot state. This gives the competition system a consistent estimate of plate trajectories as the robot moves and rotates, supporting accurate aim at the designated plates.
