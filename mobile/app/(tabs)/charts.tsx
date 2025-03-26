import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import {
  BarChart,
  PieChart,
} from 'react-native-chart-kit';

import { theme } from '../../styles/theme'; // <-- Adjust path as needed

const screenWidth = Dimensions.get('window').width;

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  time: string; // e.g. "3:00 PM"
}

type FilterOption = 'Daily' | 'Weekly';

export default function ChartsScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Single chart data for Task Completion Trends
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<FilterOption>('Daily');

  // Category Distribution
  const [categoryPieData, setCategoryPieData] = useState<any[]>([]);

  // Pending vs Completed Pie Chart
  const [pendingCompletedData, setPendingCompletedData] = useState<[number, number]>([0, 0]);

  // Productivity Score
  const [productivityScore, setProductivityScore] = useState(0);

  // Fade-in for the entire screen
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  
  // Scale animations for charts
  const barChartScaleAnim = useRef(new Animated.Value(0.9)).current;
  const pieChartScaleAnim = useRef(new Animated.Value(0.9)).current;
  const pieChart2ScaleAnim = useRef(new Animated.Value(0.9)).current;

  // Productivity Score animation
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const [animatedScore, setAnimatedScore] = useState(0);

  // Chart config with a subtle gradient (no harsh white background)
  const chartConfig = {
    backgroundGradientFrom: theme.colors.pastelBlue,
    backgroundGradientTo: theme.colors.pastelGreen,
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    fillShadowGradient: theme.colors.pastelPurple,  // For bar fill color
    fillShadowGradientOpacity: 0.8,
    barPercentage: 0.6,
  };

  // Load tasks every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
      return () => {};
    }, [])
  );

  // Animate screen & charts in
  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(barChartScaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(pieChartScaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(pieChart2ScaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tasks]);

  // Animate productivity score “count-up”
  useEffect(() => {
    Animated.timing(scoreAnim, {
      toValue: productivityScore,
      duration: 800,
      useNativeDriver: false, // we need actual numeric interpolation
    }).start();

    scoreAnim.addListener(({ value }) => {
      setAnimatedScore(Math.round(value));
    });

    return () => {
      scoreAnim.removeAllListeners();
    };
  }, [productivityScore]);

  // Recalculate analytics whenever tasks or filter changes
  useEffect(() => {
    if (tasks.length > 0) {
      calculateAnalytics();
    } else {
      setChartData([]);
      setChartLabels([]);
      setCategoryPieData([]);
      setPendingCompletedData([0, 0]);
      setProductivityScore(0);
    }
  }, [tasks, timeFilter]); 

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem('@tasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log('Error loading tasks', error);
    }
  };

  const calculateAnalytics = () => {
    calculateTaskCompletionTrends();
    calculateCategoryDistribution();
    calculatePendingCompleted();
    calculateProductivityScore();
  };

  // 1) Task Completion Trends (Daily/Weekly/)
  const calculateTaskCompletionTrends = () => {
    if (timeFilter === 'Daily') {
      setChartLabels(['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7']);
      const completedCount = tasks.filter(t => t.completed).length;
      const dailyArr = [0, 0, 0, 0, 0, 0, completedCount]; // basic placeholder
      setChartData(dailyArr);
    } else if (timeFilter === 'Weekly') {
      setChartLabels(['Week 1','Week 2','Week 3','Week 4']);
      const completedCount = tasks.filter(t => t.completed).length;
      const weeklyArr = [0, 0, 0, completedCount]; 
      setChartData(weeklyArr);
    }
    
  };

  // 2) Category Distribution
  const calculateCategoryDistribution = () => {
    const catMap: { [key: string]: number } = {};
    tasks.forEach(t => {
      const cat = t.category || 'Uncategorized';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    // Use multiple pastel colors
    const pastelColors = [
      theme.colors.pastelPink,
      theme.colors.pastelBlue,
      theme.colors.pastelGreen,
      theme.colors.pastelYellow,
      theme.colors.pastelPurple,
    ];

    let idx = 0;
    const pieData = Object.entries(catMap).map(([cat, count]) => {
      const color = pastelColors[idx % pastelColors.length];
      idx++;
      return {
        name: cat,
        population: count,
        color,
        legendFontColor: theme.colors.text,
        legendFontSize: 12,
      };
    });

    setCategoryPieData(pieData);
  };

  // 3) Pending vs Completed
  const calculatePendingCompleted = () => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    setPendingCompletedData([pending, completed]);
  };

  // 4) Productivity Score
  const calculateProductivityScore = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const rate = total > 0 ? completed / total : 0;
    // Arbitrary formula
    const score = (rate * 70) + (rate * 30);
    setProductivityScore(Math.round(score));
  };

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>Analytics & Charts</Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['Daily','Weekly'] as FilterOption[]).map(option => {
            const active = option === timeFilter;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterButton,
                  active && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setTimeFilter(option)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    active && { color: theme.colors.white },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Task Completion Trends */}
        <Text style={styles.sectionTitle}>Task Completion Trends</Text>
        {chartData.length > 0 && chartLabels.length > 0 && (
          <Animated.View style={{ transform: [{ scale: barChartScaleAnim }] }}>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartData }],
              }}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              withInnerLines={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              showValuesOnTopOfBars
            />
          </Animated.View>
        )}

        {/* Category Distribution */}
        <Text style={styles.sectionTitle}>Category Distribution</Text>
        {categoryPieData.length > 0 && (
          <Animated.View style={{ transform: [{ scale: pieChartScaleAnim }] }}>
            <PieChart
              data={categoryPieData}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </Animated.View>
        )}

        {/* Pending vs Completed (Pie) - NO TEXT ABOVE IT */}
        <Animated.View style={{ transform: [{ scale: pieChart2ScaleAnim }] }}>
          <PieChart
            data={[
              {
                name: 'Pending',
                population: pendingCompletedData[0],
                color: theme.colors.pastelPink,
                legendFontColor: theme.colors.text,
                legendFontSize: 13,
              },
              {
                name: 'Completed',
                population: pendingCompletedData[1],
                color: theme.colors.pastelPurple,
                legendFontColor: theme.colors.text,
                legendFontSize: 13,
              },
            ]}
            width={screenWidth * 0.9}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Animated.View>

        {/* Productivity Score */}
        <Text style={styles.sectionTitle}>Productivity Score</Text>
        <Text style={styles.scoreText}>{animatedScore} / 100</Text>
        <Text style={styles.centerText}>
          {animatedScore >= 80
            ? 'Awesome job! You’re a Task Master.'
            : animatedScore >= 50
            ? 'Good progress! Keep pushing ahead.'
            : 'Let’s ramp it up and get more done!'}
        </Text>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  title: {
    fontSize: theme.fontSizes.xlarge,
    color: theme.colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  chart: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  centerText: {
    color: theme.colors.text,
    textAlign: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  scoreText: {
    fontSize: theme.fontSizes.xlarge,
    color: theme.colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
