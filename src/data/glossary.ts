// src/data/glossary.ts

export interface GlossaryTerm {
  slug: string;           // URL-safe, lowercase-hyphenated
  term: string;           // Display name
  shortDefinition: string; // 1 sentence, for hub page card
  fullDefinition: string;  // 300-500 words for individual page
  relatedTerms: string[];  // slugs of related glossary terms
  relatedCalculators: Array<{ name: string; href: string }>;  // links to relevant calculators
  sources: Array<{ name: string; year: string; url?: string }>; // citations
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'one-rep-max',
    term: '1RM / One-Rep Max',
    shortDefinition: 'The maximum amount of weight a lifter can lift for a single repetition with proper form.',
    fullDefinition: 'The One-Repetition Maximum (1RM) is generally defined as the greatest weight that can be lifted with proper technique for only one repetition. In sports science and strength training, it is considered the gold standard for measuring absolute muscle strength in a specific exercise. The 1RM is a vital metric because it provides a baseline from which training intensities (percentages of 1RM) are calculated. For example, a program might call for 3 sets of 5 repetitions at 80% of your 1RM. Measuring 1RM directly requires a maximal lifting protocol, which involves a progressive warmup leading to a single, maximum-effort attempt. Because direct maximal testing carries a higher risk of injury, joint strain, and requires significant recovery time, it is often reserved for advanced athletes or competitive events. For recreational lifters, submaximal estimation formulas are frequently used instead to find an estimated 1RM. Understanding your 1RM helps ensure you are lifting at an intensity that matches your specific training goals, whether that is absolute strength (85%+ 1RM), hypertrophy (65%-80% 1RM), or muscular endurance (under 60% 1RM).',
    relatedTerms: ['estimated-one-rep-max', 'relative-strength', 'rpe'],
    relatedCalculators: [
      { name: 'One Rep Max Calculator', href: '/calculators/one-rep-max-calculator' },
      { name: 'Bench Press 1RM Calculator', href: '/calculators/bench-press-one-rep-max-calculator' }
    ],
    sources: [
      { name: 'NSCA Essentials of Strength Training and Conditioning', year: '2016' },
      { name: 'Journal of Strength and Conditioning Research', year: '2003' }
    ]
  },
  {
    slug: 'estimated-one-rep-max',
    term: 'Estimated 1RM (e1RM)',
    shortDefinition: 'An estimation of your maximum single-rep lift calculated from submaximal sets.',
    fullDefinition: 'Estimated One-Repetition Maximum (e1RM) is a mathematical estimation of a lifter\'s maximum single-repetition capacity, derived from submaximal lifting performance. Rather than testing a maximum single lift to failure—which presents safety risks and severe neurological fatigue—e1RM calculations use formulas based on the relationship between weight, repetitions, and fatigue. The most common formulas include the Epley and Brzycki equations. The Epley formula is expressed as: 1RM = w * (1 + r / 30), where w is the weight lifted and r is the number of repetitions. The Brzycki formula is expressed as: 1RM = w / (1.0278 - 0.0278 * r). Research indicates these mathematical models are highly accurate when the repetitions performed are low (typically fewer than 10 reps). As repetitions exceed 10, individual muscular endurance variations make the formulas increasingly unreliable. In modern strength programs, e1RM is calculated dynamically after each training session to track strength progress and adjust training loads without needing frequent, taxing maximal testing sessions.',
    relatedTerms: ['one-rep-max', 'rpe', 'rir'],
    relatedCalculators: [
      { name: 'One Rep Max Calculator', href: '/calculators/one-rep-max-calculator' },
      { name: 'Squat 1RM Calculator', href: '/calculators/squat-one-rep-max-calculator' }
    ],
    sources: [
      { name: 'Epley, W. Boyd. Journal of Strength and Conditioning Research', year: '1985' },
      { name: 'Brzycki, Matt. Journal of Physical Education, Recreation & Dance', year: '1993' }
    ]
  },
  {
    slug: 'rpe',
    term: 'Rate of Perceived Exertion (RPE)',
    shortDefinition: 'A subjective scale used to measure the intensity of a lift or training set.',
    fullDefinition: 'The Rate of Perceived Exertion (RPE) is a subjective method used to gauge the intensity of a training set. While originally developed by Gunnar Borg as a 6-to-20 scale for cardiovascular exercise, modern resistance training utilizes a modified 1-to-10 scale popularized by powerlifting coach Mike Tuchscherer. The lifting-specific RPE scale is directly anchored to "Reps in Reserve" (RIR). An RPE 10 indicates a maximal effort set where no additional repetitions or weight could have been handled. An RPE 9 means the lifter could have completed exactly 1 more repetition. RPE 8 indicates 2 repetitions left in the tank, and so on. Half-point ratings (such as RPE 8.5) suggest that while another full repetition was not possible, a small increase in weight was. RPE is a cornerstone of autoregulation in strength training. Autoregulation adjusts the day\'s training load based on the lifter\'s current readiness, accounting for factors like sleep, stress, and nutrition. By prescribing training loads using RPE (e.g., "Squat 3x5 at RPE 8") instead of fixed percentages, lifters can train at the optimal physiological intensity for that day, reducing the risk of overtraining and injury.',
    relatedTerms: ['rir', 'estimated-one-rep-max', 'periodization'],
    relatedCalculators: [
      { name: 'One Rep Max Calculator', href: '/calculators/one-rep-max-calculator' }
    ],
    sources: [
      { name: 'Borg, Gunnar. Borg\'s Perceived Exertion and Pain Scales', year: '1998' },
      { name: 'Tuchscherer, Mike. Reactive Training Manual', year: '2008' }
    ]
  },
  {
    slug: 'rir',
    term: 'Reps in Reserve (RIR)',
    shortDefinition: 'A measure of intensity defined by how many reps you could do before muscle failure.',
    fullDefinition: 'Reps in Reserve (RIR) is an intensity-regulation metric that represents the number of additional repetitions a lifter could have performed before reaching muscular failure in a given set. RIR is inversely related to the Rate of Perceived Exertion (RPE) scale; for example, 0 RIR corresponds to RPE 10, 1 RIR corresponds to RPE 9, and 2 RIR corresponds to RPE 8. Prescribing training by RIR allows lifters to control the proximity to failure. Research in exercise science indicates that training to absolute muscular failure is not always necessary for hypertrophy and can be counterproductive for absolute strength development due to the excessive fatigue it generates. By maintaining a buffer (typically 1 to 3 RIR), lifters can maximize mechanical tension and recruit high-threshold motor units while managing fatigue, allowing for higher training frequency and volume. Utilizing RIR requires a degree of training experience, as beginners often struggle to accurately predict how close they are to true muscular failure. Regular submaximal check-ins or occasional sets taken to failure can help lifters calibrate their subjective RIR estimates.',
    relatedTerms: ['rpe', 'one-rep-max', 'hypertrophy'],
    relatedCalculators: [
      { name: 'One Rep Max Calculator', href: '/calculators/one-rep-max-calculator' }
    ],
    sources: [
      { name: 'Helms et al. Journal of Strength and Conditioning Research', year: '2016' },
      { name: 'Schoenfeld, Brad. Science and Development of Muscle Hypertrophy', year: '2020' }
    ]
  },
  {
    slug: 'progressive-overload',
    term: 'Progressive Overload',
    shortDefinition: 'The gradual increase of physical stress placed on the body to force adaptation.',
    fullDefinition: 'Progressive Overload is the foundational principle of athletic training, stating that the stress placed on the musculoskeletal system must be gradually increased over time to force ongoing adaptations in strength, power, or muscle size. When you lift a weight, your body experiences micro-tears and metabolic stress. With proper recovery, the body adapts by building stronger muscle fibers and improving neurological pathways. If you continue to lift the exact same weight for the same repetitions, the body has no physiological reason to adapt further, and progress plateaus. Progressive overload can be implemented through multiple variables: increasing the absolute load (weight on the bar), increasing the training volume (total repetitions or sets), increasing training frequency, improving lifting technique (greater control or range of motion), or reducing rest intervals between sets. In a well-structured training program, overload is applied systematically and is interspersed with planned recovery periods (deloads) to prevent injury and accumulated fatigue. Without progressive overload, long-term athletic improvement is physically impossible.',
    relatedTerms: ['periodization', 'hypertrophy', 'one-rep-max'],
    relatedCalculators: [
      { name: 'Strength Index Calculator', href: '/calculators/strength-index' }
    ],
    sources: [
      { name: 'DeLorme, Thomas. Journal of Bone and Joint Surgery', year: '1945' },
      { name: 'Garhammer, John. Journal of Strength and Conditioning Research', year: '1989' }
    ]
  },
  {
    slug: 'relative-strength',
    term: 'Relative Strength',
    shortDefinition: 'Your physical strength measured in relation to your scale bodyweight.',
    fullDefinition: 'Relative Strength refers to an individual\'s strength capacity in relation to their scale bodyweight. Unlike absolute strength, which measures the maximum total weight a lifter can move regardless of body size, relative strength is calculated by dividing the absolute load lifted by the lifter\'s body mass (e.g., lifting 2.0 times bodyweight). Relative strength is the critical metric in gymnastics, calisthenics, weight-category sports, and scaling assessments. Due to biological scaling laws, smaller lifters naturally possess greater relative strength because muscle cross-sectional area (which determines force output) scales in two dimensions, whereas body weight scales in three dimensions. This biological reality means a 60 kg lifter squating 120 kg (2.0x bodyweight) is performing a feat that requires similar relative efficiency to a 120 kg lifter squating 240 kg, even though the absolute weights differ dramatically. Maximizing relative strength is crucial for athletes who need to accelerate their own body through space, and is achieved by increasing motor unit recruitment and muscle density while minimizing unnecessary non-functional mass (body fat).',
    relatedTerms: ['wilks-score', 'dots-score', 'strength-index'],
    relatedCalculators: [
      { name: 'Relative Strength Calculator', href: '/calculators/relative-strength' },
      { name: 'Strength Index Calculator', href: '/calculators/strength-index' }
    ],
    sources: [
      { name: 'Schmidtbleicher, D. Strength and Power in Sport', year: '1992' },
      { name: 'Journal of Applied Physiology', year: '2005' }
    ]
  },
  {
    slug: 'wilks-score',
    term: 'Wilks Score',
    shortDefinition: 'A legacy mathematical formula used to compare strength across weight classes.',
    fullDefinition: 'The Wilks Score is a mathematical coefficient system developed by Robert Wilks in 1995. It was created to compare the lifting performance of powerlifters across different bodyweight classes and genders. Because lighter lifters can lift more weight relative to their size, and heavier lifters can lift more absolute weight, comparing them directly is unfair. The Wilks formula solves this by multiplying a lifter\'s combined three-lift total (Squat + Bench Press + Deadlift) by a specific coefficient derived from a fifth-order polynomial equation. The coefficients differ for men and women, based on historical competition databases. For over two decades, the Wilks score was the global gold standard for determining the "Best Lifter" at powerlifting competitions. In recent years, however, statistical analysis revealed that the Wilks formula exhibits bias, slightly favoring lifters at the extreme lightweight and super heavyweight ends of the spectrum. Consequently, many major federations have transitioned to newer formulas like DOTS or IPF GL points, though Wilks remains popular for historical comparisons.',
    relatedTerms: ['dots-score', 'ipf-gl-points', 'relative-strength'],
    relatedCalculators: [
      { name: 'Powerlifting Wilks Calculator', href: '/calculators/wilks-calculator' },
      { name: 'DOTS & Wilks Comparison Page', href: '/compare/dots-vs-wilks-vs-ipf-gl' }
    ],
    sources: [
      { name: 'Wilks, Robert. IPF Technical Rules Guidelines', year: '1995' }
    ]
  },
  {
    slug: 'dots-score',
    term: 'DOTS Score',
    shortDefinition: 'A modern coefficient system used by powerlifting federations to normalize lifting totals.',
    fullDefinition: 'The DOTS Score (Dynamic Objective Team Scoring) is a modern powerlifting coefficient formula developed by Jäger and Pock in 2013. It was created to resolve the statistical imbalances present in the legacy Wilks formula. The Wilks system, while revolutionary, was shown to penalize middleweight lifters while over-rewarding athletes at extreme light and heavy bodyweights. The DOTS formula addresses this by utilizing a fourth-order polynomial function with clamped variables, producing a more mathematically uniform curve. This ensures that a given score represents a consistent level of relative physical output, regardless of whether the lifter weighs 60 kg or 120 kg. DOTS is currently the primary coefficient system used by major raw powerlifting organizations, including the United States Powerlifting Association (USPA) and USA Powerlifting (USAPL), to award absolute champion titles across weight classes.',
    relatedTerms: ['wilks-score', 'ipf-gl-points', 'relative-strength'],
    relatedCalculators: [
      { name: 'Powerlifting Wilks Calculator', href: '/calculators/wilks-calculator' },
      { name: 'DOTS & Wilks Comparison Page', href: '/compare/dots-vs-wilks-vs-ipf-gl' }
    ],
    sources: [
      { name: 'Jäger & Pock. Dynamically Objective Team Scoring System', year: '2013' }
    ]
  },
  {
    slug: 'ipf-gl-points',
    term: 'IPF GL Points',
    shortDefinition: 'The official points system of the International Powerlifting Federation.',
    fullDefinition: 'IPF GL Points (Good Lift Points) is the official coefficient scoring system introduced by the International Powerlifting Federation (IPF) in 2020 to replace the Wilks formula. Unlike the polynomial curves used by Wilks and DOTS, the IPF GL system utilizes exponential decay equations to calculate points. Exponential curves prevent the sudden mathematical anomalies that can occur at the ends of polynomial graphs, ensuring fairer comparisons for extreme lightweights and super heavyweights. Furthermore, the IPF GL points database is divided into distinct categories for raw (unequipped) and equipped lifters, recognizing that supportive equipment shifts leverage and alters the scaling relationship between bodyweight and strength. IPF GL points are used at all IPF-affiliated international and national championships to determine absolute best lifter awards.',
    relatedTerms: ['wilks-score', 'dots-score', 'relative-strength'],
    relatedCalculators: [
      { name: 'Powerlifting Wilks Calculator', href: '/calculators/wilks-calculator' },
      { name: 'DOTS & Wilks Comparison Page', href: '/compare/dots-vs-wilks-vs-ipf-gl' }
    ],
    sources: [
      { name: 'IPF Technical Committee. IPF Technical Rules Book', year: '2020' }
    ]
  },
  {
    slug: 'strength-index',
    term: 'Strength Index',
    shortDefinition: 'An overall rating of your strength computed from your performance across core lifts.',
    fullDefinition: 'The Strength Index is a consolidated assessment score used by StrengthChecker to evaluate an individual\'s overall physical strength relative to both general and training populations. While metrics like Wilks focus strictly on competitive powerlifting movements, the Strength Index evaluates a lifter holistically by assessing performance across multiple core movement patterns: squatting (lower body push), deadlifting (posterior chain hinge), pressing (upper body push), and pulling (upper body pull). By comparing the lifter\'s submaximal or maximal performance in these movements against normalized population percentile curves, the Strength Index provides a score out of 100. This multi-movement assessment prevents bias toward athletes who have specialized leverages for a single lift, offering a more balanced reflection of comprehensive skeletal-muscle capacity and athletic performance.',
    relatedTerms: ['relative-strength', 'percentile', 'compound-lift'],
    relatedCalculators: [
      { name: 'Strength Index Calculator', href: '/calculators/strength-index' }
    ],
    sources: [
      { name: 'StrengthChecker Methodology & Population Analysis', year: '2026' }
    ]
  },
  {
    slug: 'compound-lift',
    term: 'Compound Lift',
    shortDefinition: 'A multi-joint exercise that recruits multiple muscle groups simultaneously.',
    fullDefinition: 'A Compound Lift is generally defined as an exercise that involves movement across multiple joints and recruits several muscle groups simultaneously. Classic examples include the back squat (involving ankle, knee, and hip joints), the deadlift, the bench press, the overhead press, and the pull-up. Compound exercises are the cornerstone of strength training and powerlifting programs. Because they recruit a large volume of muscle mass, they allow for the loading of heavy weights, which maximizes mechanical tension—the primary driver of strength adaptations. Furthermore, compound lifts trigger a greater systemic hormonal response and improve intermuscular coordination (the ability of different muscles to work together to execute a movement) compared to isolation exercises. They are highly efficient for building overall physical capacity and are the primary movements evaluated in strength standards.',
    relatedTerms: ['isolation-exercise', 'progressive-overload', 'strength-index'],
    relatedCalculators: [
      { name: 'Strength Index Calculator', href: '/calculators/strength-index' },
      { name: 'One Rep Max Calculator', href: '/calculators/one-rep-max-calculator' }
    ],
    sources: [
      { name: 'NSCA Essentials of Strength Training and Conditioning', year: '2016' }
    ]
  },
  {
    slug: 'isolation-exercise',
    term: 'Isolation Exercise',
    shortDefinition: 'A single-joint movement designed to target a specific muscle group.',
    fullDefinition: 'An Isolation Exercise is an exercise that involves movement at only one joint and is designed to target a specific muscle group in relative isolation. Common examples include the biceps curl (elbow joint only), the leg extension (knee joint only), and the lateral raise (shoulder joint only). While compound lifts are superior for building absolute strength and athletic coordination, isolation movements are valuable tools for targeting weak points, correcting muscular imbalances, and accumulating local volume for hypertrophy without generating high systemic fatigue. Isolation exercises are frequently placed at the end of strength workouts to focus on specific muscles that may not have reached full stimulation during the primary compound movements.',
    relatedTerms: ['compound-lift', 'hypertrophy', 'progressive-overload'],
    relatedCalculators: [
      { name: 'Pull Ups 1RM Calculator', href: '/calculators/pull-ups-one-rep-max-calculator' }
    ],
    sources: [
      { name: 'Journal of Strength and Conditioning Research', year: '2012' }
    ]
  },
  {
    slug: 'percentile',
    term: 'Strength Percentile',
    shortDefinition: 'A statistical rank showing the percentage of lifters you out-lift.',
    fullDefinition: 'A Strength Percentile is a statistical metric that ranks a lifter\'s performance relative to a reference population. For example, if a lifter is in the 75th percentile for the bench press, it means they lift more weight than 75% of lifters within their specific demographic (gender, bodyweight, and age group), while the remaining 25% lift more than them. Percentiles provide context to raw lifting numbers, transforming an absolute value (e.g., a 100 kg bench press) into a relative measure of capability. StrengthChecker utilizes large databases of competition and training logs to construct these percentile curves, allowing lifters to understand exactly where they stand in the spectrum of strength, ranging from complete beginners (lower percentiles) to competitive elite lifters (95th+ percentile).',
    relatedTerms: ['strength-index', 'relative-strength', 'wilks-score'],
    relatedCalculators: [
      { name: 'Strength Index Calculator', href: '/calculators/strength-index' }
    ],
    sources: [
      { name: 'OpenPowerlifting Database Statistics', year: '2025' }
    ]
  },
  {
    slug: 'hypertrophy',
    term: 'Muscle Hypertrophy',
    shortDefinition: 'The growth and enlargement of muscle cells and fibers.',
    fullDefinition: 'Muscle Hypertrophy refers to the physiological enlargement of skeletal muscle tissue, primarily occurring through an increase in the cross-sectional area of individual muscle fibers (fiber hypertrophy) rather than an increase in the number of fibers. The process is driven by three primary stimuli: mechanical tension (exerting force against resistance), muscle damage (micro-tears in muscle fibers), and metabolic stress (the accumulation of metabolites during high-repetition training). Strength training protocols targeting hypertrophy typically prescribe moderate loading (60% to 80% of 1RM, equivalent to 8 to 12 repetitions per set) performed close to failure (1 to 3 Reps in Reserve) to maximize muscle recruitment and volume. Adequate dietary protein and systemic recovery are required to synthesize new contractile proteins (myofibrils) and enlarge the sarcoplasmic fluid, resulting in increased muscle mass and potential for force generation.',
    relatedTerms: ['progressive-overload', 'rir', 'isolation-exercise'],
    relatedCalculators: [
      { name: 'One Rep Max Calculator', href: '/calculators/one-rep-max-calculator' }
    ],
    sources: [
      { name: 'Schoenfeld, Brad. Science and Development of Muscle Hypertrophy', year: '2020' }
    ]
  },
  {
    slug: 'periodization',
    term: 'Periodization',
    shortDefinition: 'The systematic structure and planning of a strength training program.',
    fullDefinition: 'Periodization is the systematic planning and structuring of a training program to optimize performance, manage fatigue, and prevent overtraining or plateauing. The training cycle is typically divided into specific timeframes: macrocycles (the overall training year or season), mesocycles (blocks of 4 to 12 weeks focusing on a specific adaptation like hypertrophy or strength), and microcycles (typically a single training week). Periodization strategies can be linear (gradually increasing intensity while decreasing volume over time) or block/undulating (varying intensity and volume within a week or block). By systematically manipulating training variables (weight, reps, sets, rest), periodization ensures that the lifter undergoes progressive stress, adapts, recovers via planned deload weeks, and reaches peak performance at specific competitive milestones.',
    relatedTerms: ['progressive-overload', 'rpe', 'one-rep-max'],
    relatedCalculators: [
      { name: 'Strength Index Calculator', href: '/calculators/strength-index' }
    ],
    sources: [
      { name: 'NSCA Essentials of Strength Training and Conditioning', year: '2016' },
      { name: 'Haff & Stone. Periodization: Theory and Methodology', year: '2015' }
    ]
  }
];
