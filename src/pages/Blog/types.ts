export type TrangThaiBaiViet = 'nhap' | 'da-dang';

export interface TheTag {
    id: string;
    ten: string;
    slug: string;
    mauSac: string;
}

export interface BaiViet {
    id: string;
    tieuDe: string;
    slug: string;
    tomTat: string;
    noiDung: string;
    anhDaiDien: string;
    tacGia: string;
    tagIds: string[];
    trangThai: TrangThaiBaiViet;
    luotXem: number;
    ngayTao: string;
    ngayCapNhat: string;
}

export interface TacGia {
    ten: string;
    anhDaiDien: string;
    tieuSu: string;
    kyNang: string[];
    mxh: { github?: string; twitter?: string; linkedin?: string; website?: string };
}

export const STORAGE_KEYS = {
    BAI_VIET: 'blog_bai_viet',
    THE_TAG: 'blog_the_tag',
    TAC_GIA: 'blog_tac_gia',
};

export const getFromStorage = <T>(key: string, def: T): T => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : def;
    } catch {
        return def;
    }
};

export const saveToStorage = <T>(key: string, value: T) =>
    localStorage.setItem(key, JSON.stringify(value));

export const generateId = (prefix: string, existingIds: string[] = []): string => {
    let n = existingIds.length + 1;
    let id = `${prefix}${String(n).padStart(3, '0')}`;
    while (existingIds.includes(id)) { n++; id = `${prefix}${String(n).padStart(3, '0')}`; }
    return id;
};

export const normalizeStr = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, (c) => c === 'đ' ? 'd' : 'D').toLowerCase();

export const toSlug = (s: string) =>
    normalizeStr(s).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const TAG_COLORS = [
    'blue', 'cyan', 'green', 'orange', 'red', 'purple', 'magenta', 'gold', 'lime', 'geekblue',
];

export const seedTags: TheTag[] = [
    { id: 'tag-1', ten: 'Python', slug: 'python', mauSac: 'blue' },
    { id: 'tag-2', ten: 'SQL', slug: 'sql', mauSac: 'geekblue' },
    { id: 'tag-3', ten: 'Apache Spark', slug: 'apache-spark', mauSac: 'orange' },
    { id: 'tag-4', ten: 'Kafka', slug: 'kafka', mauSac: 'red' },
    { id: 'tag-5', ten: 'Data Warehouse', slug: 'data-warehouse', mauSac: 'purple' },
    { id: 'tag-6', ten: 'ETL Pipeline', slug: 'etl-pipeline', mauSac: 'cyan' },
    { id: 'tag-7', ten: 'Machine Learning', slug: 'machine-learning', mauSac: 'green' },
    { id: 'tag-8', ten: 'Tips & Tricks', slug: 'tips-tricks', mauSac: 'gold' },
];

export const seedTacGia: TacGia = {
    ten: 'Lâm Đức Bảo',
    anhDaiDien: 'https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute-1-1.jpg',
    tieuSu: 'Data Engineer với đam mê xây dựng các hệ thống dữ liệu lớn, ETL pipeline và data warehouse. Chuyên sâu về Python, Apache Spark và SQL. Thích chia sẻ kiến thức về kỹ thuật xử lý dữ liệu và best practices trong ngành.',
    kyNang: ['Python', 'Apache Spark', 'SQL/PostgreSQL', 'Apache Kafka', 'Airflow', 'dbt', 'BigQuery', 'Docker & Kubernetes', 'Power BI', 'Git'],
    mxh: {
        github: 'https://github.com/DucBao-218',
        twitter: 'https://twitter.com/lamducbao',
        linkedin: 'https://www.linkedin.com/in/b%E1%BA%A3o-l%C3%A2m-%C4%91%E1%BB%A9c-860ba5353/',
        website: 'https://www.facebook.com/lam.uc.bao/',
    },
};

export const seedBaiViets: BaiViet[] = [
    {
        id: 'BV001', tieuDe: 'Xây dựng ETL Pipeline với Python và Apache Airflow',
        slug: 'xay-dung-etl-pipeline-python-airflow',
        tomTat: 'Hướng dẫn thiết kế và triển khai ETL pipeline tự động hóa hoàn chỉnh sử dụng Python và Apache Airflow, bao gồm scheduling, error handling và monitoring.',
        noiDung: `# Xây dựng ETL Pipeline với Python và Apache Airflow\n\nETL (Extract – Transform – Load) là trái tim của mọi hệ thống dữ liệu hiện đại.\n\n## 1. Apache Airflow là gì?\n\nAirflow là nền tảng orchestration mạnh mẽ, cho phép bạn định nghĩa workflow dưới dạng DAG (Directed Acyclic Graph).\n\n## 2. Cài đặt Airflow\n\n\`\`\`bash\npip install apache-airflow\nairflow db init\nairflow webserver --port 8080\n\`\`\`\n\n## 3. Viết DAG đầu tiên\n\n\`\`\`python\nfrom airflow import DAG\nfrom airflow.operators.python import PythonOperator\nfrom datetime import datetime\n\ndef extract(): ...\ndef transform(): ...\ndef load(): ...\n\nwith DAG('etl_pipeline', start_date=datetime(2024,1,1), schedule='@daily') as dag:\n    t1 = PythonOperator(task_id='extract', python_callable=extract)\n    t2 = PythonOperator(task_id='transform', python_callable=transform)\n    t3 = PythonOperator(task_id='load', python_callable=load)\n    t1 >> t2 >> t3\n\`\`\`\n\n## Kết luận\n\nAirflow giúp pipeline của bạn trở nên đáng tin cậy, dễ giám sát và mở rộng.`,
        anhDaiDien: 'https://cdn.mcivietnam.com/nhanvien/media/Blog/chatgpt-image-oct-14-2025-10_56_59-ampngd46e4g.png',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-1', 'tag-6'], trangThai: 'da-dang',
        luotXem: 1840, ngayTao: '2025-01-08', ngayCapNhat: '2025-01-08',
    },
    {
        id: 'BV002', tieuDe: 'Apache Spark: Xử lý Big Data hàng tỷ dòng',
        slug: 'apache-spark-xu-ly-big-data',
        tomTat: 'Khám phá cách Apache Spark xử lý dữ liệu phân tán ở quy mô hàng tỷ bản ghi với tốc độ chóng mặt — từ RDD đến DataFrame API và Spark SQL.',
        noiDung: `# Apache Spark: Xử lý Big Data hàng tỷ dòng\n\n## Tại sao Spark?\n\nSpark nhanh hơn Hadoop MapReduce tới 100 lần nhờ xử lý in-memory.\n\n## DataFrame API\n\n\`\`\`python\nfrom pyspark.sql import SparkSession\n\nspark = SparkSession.builder.appName('BigData').getOrCreate()\ndf = spark.read.parquet('s3://my-bucket/data/')\ndf.filter(df.amount > 1000).groupBy('region').sum('amount').show()\n\`\`\`\n\n## Spark SQL\n\n\`\`\`python\ndf.createOrReplaceTempView('sales')\nresult = spark.sql('SELECT region, SUM(amount) FROM sales GROUP BY region')\n\`\`\`\n\n## Tối ưu hiệu suất\n\n- Dùng Parquet thay CSV\n- Broadcast join cho bảng nhỏ\n- Caching dữ liệu tái sử dụng\n\n## Kết luận\n\nSpark là công cụ không thể thiếu trong bộ toolkit của Data Engineer.`,
        anhDaiDien: 'https://statics.cdn.200lab.io/2023/04/apache-spark-la-gi-2.png?width=1200',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-3', 'tag-1'], trangThai: 'da-dang',
        luotXem: 2310, ngayTao: '2025-01-22', ngayCapNhat: '2025-01-22',
    },
    {
        id: 'BV003', tieuDe: 'Thiết kế Data Warehouse với mô hình Star Schema',
        slug: 'thiet-ke-data-warehouse-star-schema',
        tomTat: 'Hướng dẫn toàn diện thiết kế Data Warehouse: Fact table, Dimension table, Star Schema vs Snowflake Schema và cách triển khai trên BigQuery.',
        noiDung: `# Thiết kế Data Warehouse với Star Schema\n\n## Star Schema là gì?\n\nStar Schema gồm một Fact Table trung tâm kết nối với nhiều Dimension Table.\n\n## Ví dụ thiết kế\n\n\`\`\`sql\n-- Fact table\nCREATE TABLE fact_sales (\n  sale_id BIGINT PRIMARY KEY,\n  date_id INT,\n  product_id INT,\n  customer_id INT,\n  amount DECIMAL(18,2),\n  quantity INT\n);\n\n-- Dimension table\nCREATE TABLE dim_date (\n  date_id INT PRIMARY KEY,\n  full_date DATE,\n  year INT, month INT, day INT, quarter INT\n);\n\`\`\`\n\n## Star vs Snowflake\n\n| Tiêu chí | Star | Snowflake |\n|---|---|---|\n| Query speed | Nhanh hơn | Chậm hơn |\n| Lưu trữ | Nhiều hơn | Ít hơn |\n| Độ phức tạp | Đơn giản | Phức tạp |\n\n## Kết luận\n\nStar Schema là lựa chọn phổ biến nhờ hiệu suất query tốt và dễ hiểu.`,
        anhDaiDien: 'https://media.licdn.com/dms/image/v2/D5612AQEcC5y_6EmzKg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1721179767861?e=2147483647&v=beta&t=DvyA9Ch6iIOwn2K2xPuW6i47rP3NlwTHf5qflfQHkjQ',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-5', 'tag-2'], trangThai: 'da-dang',
        luotXem: 1650, ngayTao: '2025-02-03', ngayCapNhat: '2025-02-03',
    },
    {
        id: 'BV004', tieuDe: 'Apache Kafka: Streaming Data Real-time',
        slug: 'apache-kafka-streaming-data-real-time',
        tomTat: 'Tìm hiểu kiến trúc Kafka, cách thiết lập producer/consumer và xây dựng hệ thống streaming data real-time xử lý hàng triệu sự kiện mỗi giây.',
        noiDung: `# Apache Kafka: Streaming Data Real-time\n\n## Kafka là gì?\n\nKafka là distributed event streaming platform, xử lý hàng triệu events/giây.\n\n## Kiến trúc cốt lõi\n\n- **Producer**: Gửi message vào Topic\n- **Topic**: Phân loại message theo chủ đề\n- **Consumer**: Đọc message từ Topic\n- **Broker**: Server Kafka lưu trữ message\n\n## Python Producer\n\n\`\`\`python\nfrom kafka import KafkaProducer\nimport json\n\nproducer = KafkaProducer(\n    bootstrap_servers='localhost:9092',\n    value_serializer=lambda v: json.dumps(v).encode()\n)\nproducer.send('orders', {'order_id': 123, 'amount': 99.9})\n\`\`\`\n\n## Kết luận\n\nKafka là backbone của mọi kiến trúc data streaming hiện đại.`,
        anhDaiDien: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-4', 'tag-6'], trangThai: 'da-dang',
        luotXem: 1920, ngayTao: '2025-02-18', ngayCapNhat: '2025-02-18',
    },
    {
        id: 'BV005', tieuDe: 'SQL nâng cao: Window Functions cho phân tích dữ liệu',
        slug: 'sql-nang-cao-window-functions',
        tomTat: 'Nắm vững Window Functions trong SQL: ROW_NUMBER, RANK, LAG/LEAD, SUM OVER PARTITION để phân tích dữ liệu mạnh mẽ mà không cần GROUP BY.',
        noiDung: `# SQL nâng cao: Window Functions\n\n## Window Function là gì?\n\nWindow Functions cho phép tính toán trên một tập hàng liên quan mà không gộp kết quả.\n\n## ROW_NUMBER & RANK\n\n\`\`\`sql\nSELECT\n  employee_id, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,\n  RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;\n\`\`\`\n\n## LAG / LEAD\n\n\`\`\`sql\nSELECT\n  date, revenue,\n  LAG(revenue, 1) OVER (ORDER BY date) AS prev_revenue,\n  revenue - LAG(revenue, 1) OVER (ORDER BY date) AS growth\nFROM daily_sales;\n\`\`\`\n\n## Running Total\n\n\`\`\`sql\nSELECT date, amount,\n  SUM(amount) OVER (ORDER BY date) AS running_total\nFROM transactions;\n\`\`\`\n\n## Kết luận\n\nWindow Functions là kỹ năng SQL không thể thiếu của Data Analyst/Engineer.`,
        anhDaiDien: 'https://itprep.com.vn/wp-content/uploads/2026/03/712b1efe-74eb-43b4-b3f0-d7b08727d58c-1.jpeg',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-2', 'tag-8'], trangThai: 'da-dang',
        luotXem: 2780, ngayTao: '2025-03-05', ngayCapNhat: '2025-03-05',
    },
    {
        id: 'BV006', tieuDe: 'dbt (data build tool): Chuyển đổi dữ liệu trong Warehouse',
        slug: 'dbt-data-build-tool-chuyen-doi-du-lieu',
        tomTat: 'Hướng dẫn sử dụng dbt để viết transformation logic bằng SQL thuần, tích hợp tests, documentation và CI/CD cho data pipeline.',
        noiDung: `# dbt: Chuyển đổi dữ liệu trong Warehouse\n\n## dbt là gì?\n\ndbt (data build tool) giúp bạn viết transformation bằng SQL và quản lý chúng như code thực sự.\n\n## Model đầu tiên\n\n\`\`\`sql\n-- models/stg_orders.sql\nSELECT\n  order_id,\n  customer_id,\n  order_date,\n  total_amount\nFROM {{ source('raw', 'orders') }}\nWHERE status != 'cancelled'\n\`\`\`\n\n## Testing\n\n\`\`\`yaml\nmodels:\n  - name: stg_orders\n    columns:\n      - name: order_id\n        tests: [unique, not_null]\n\`\`\`\n\n## Lineage Graph\n\ndbt tự động tạo data lineage graph — biết chính xác dữ liệu chảy từ đâu đến đâu.\n\n## Kết luận\n\ndbt là công cụ cách mạng hóa cách Data Engineer viết và quản lý transformation.`,
        anhDaiDien: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-5', 'tag-2', 'tag-6'], trangThai: 'da-dang',
        luotXem: 1340, ngayTao: '2025-03-15', ngayCapNhat: '2025-03-15',
    },
    {
        id: 'BV007', tieuDe: 'Pandas vs Polars: Cuộc chiến DataFrame năm 2025',
        slug: 'pandas-vs-polars-dataframe-2025',
        tomTat: 'So sánh toàn diện Pandas và Polars — thư viện DataFrame thế hệ mới viết bằng Rust. Khi nào dùng cái nào? Benchmark thực tế với 100 triệu dòng dữ liệu.',
        noiDung: `# Pandas vs Polars: Cuộc chiến DataFrame 2025\n\n## Polars là gì?\n\nPolars là DataFrame library viết bằng Rust, nhanh hơn Pandas 5-20 lần với multi-threading built-in.\n\n## Benchmark\n\n| Thao tác | Pandas | Polars |\n|---|---|---|\n| Read CSV 1GB | 12.3s | 1.8s |\n| Group By | 4.7s | 0.6s |\n| Join | 8.2s | 1.1s |\n\n## Polars syntax\n\n\`\`\`python\nimport polars as pl\n\ndf = pl.read_parquet('data.parquet')\nresult = (\n    df\n    .filter(pl.col('amount') > 1000)\n    .group_by('region')\n    .agg(pl.col('amount').sum().alias('total'))\n    .sort('total', descending=True)\n)\n\`\`\`\n\n## Kết luận\n\nPolars là tương lai — nhưng Pandas vẫn đủ tốt cho phần lớn use case.`,
        anhDaiDien: 'https://media.licdn.com/dms/image/v2/D4D12AQHCt_cNl3t9Pg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1738061395128?e=2147483647&v=beta&t=i0ola0EfqggKyLMdh4UgoCZfC5LyXT79it-zfxg0BO4',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-1', 'tag-8'], trangThai: 'da-dang',
        luotXem: 3150, ngayTao: '2025-03-28', ngayCapNhat: '2025-03-28',
    },
    {
        id: 'BV008', tieuDe: 'Data Quality: Đảm bảo chất lượng dữ liệu với Great Expectations',
        slug: 'data-quality-great-expectations',
        tomTat: 'Xây dựng hệ thống kiểm soát chất lượng dữ liệu tự động với Great Expectations — định nghĩa expectations, chạy validation và tạo Data Docs.',
        noiDung: `# Data Quality với Great Expectations\n\n## Tại sao Data Quality quan trọng?\n\nDữ liệu xấu = quyết định sai. 80% thời gian Data Engineer dành cho data cleaning.\n\n## Great Expectations\n\n\`\`\`python\nimport great_expectations as gx\n\ncontext = gx.get_context()\nvalidator = context.sources.pandas_default.read_csv('data.csv')\n\nvalidator.expect_column_values_to_not_be_null('customer_id')\nvalidator.expect_column_values_to_be_between('age', min_value=0, max_value=120)\nvalidator.expect_column_values_to_be_unique('order_id')\n\nresults = validator.validate()\n\`\`\`\n\n## Tích hợp vào Airflow\n\nChạy validation như một task trong DAG để tự động chặn dữ liệu xấu.\n\n## Kết luận\n\nData Quality automation là bắt buộc trong mọi data platform nghiêm túc.`,
        anhDaiDien: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-1', 'tag-6', 'tag-8'], trangThai: 'da-dang',
        luotXem: 987, ngayTao: '2025-04-05', ngayCapNhat: '2025-04-05',
    },
    {
        id: 'BV009', tieuDe: 'Lakehouse Architecture: Kết hợp Data Lake và Data Warehouse',
        slug: 'lakehouse-architecture-data-lake-warehouse',
        tomTat: 'Tìm hiểu kiến trúc Lakehouse — giải pháp kết hợp tính linh hoạt của Data Lake và hiệu suất của Data Warehouse với Apache Iceberg và Delta Lake.',
        noiDung: `# Lakehouse Architecture\n\n## Data Lake vs Data Warehouse\n\n| | Data Lake | Data Warehouse |\n|---|---|---|\n| Schema | Schema-on-read | Schema-on-write |\n| Cost | Rẻ | Đắt |\n| Performance | Chậm | Nhanh |\n| Data types | Mọi loại | Structured |\n\n## Lakehouse = Best of Both\n\nDelta Lake và Apache Iceberg mang ACID transactions lên Data Lake.\n\n## Delta Lake Example\n\n\`\`\`python\nfrom delta import *\n\ndf.write.format('delta').mode('overwrite').save('/data/sales')\n\n# Time travel\ndf_v1 = spark.read.format('delta').option('versionAsOf', 1).load('/data/sales')\n\`\`\`\n\n## Kết luận\n\nLakehouse là xu hướng kiến trúc dữ liệu chủ đạo của 2024-2025.`,
        anhDaiDien: 'https://topdev.vn/blog/wp-content/uploads/2024/12/Image_2.png',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-5', 'tag-3'], trangThai: 'da-dang',
        luotXem: 1420, ngayTao: '2025-04-12', ngayCapNhat: '2025-04-12',
    },
    {
        id: 'BV010', tieuDe: 'ML Feature Store: Quản lý Feature cho Machine Learning',
        slug: 'ml-feature-store',
        tomTat: 'Khái niệm Feature Store, tại sao cần thiết và so sánh các giải pháp: Feast, Tecton, Hopsworks.',
        noiDung: `# ML Feature Store\n\n## Feature Store là gì?\n\nFeature Store là kho lưu trữ trung tâm cho ML features, đảm bảo consistency giữa training và serving.\n\n## Feast Example\n\n\`\`\`python\nfrom feast import FeatureStore\n\nstore = FeatureStore(repo_path='.')\nfeature_vector = store.get_online_features(\n    features=['customer_stats:total_orders'],\n    entity_rows=[{'customer_id': 123}]\n).to_dict()\n\`\`\`\n\n*(Đang viết thêm...)*`,
        anhDaiDien: 'https://carptech.vn/blog/mlops-production-ml-enterprise-scale.webp',
        tacGia: 'Lâm Đức Bảo', tagIds: ['tag-7', 'tag-1'], trangThai: 'nhap',
        luotXem: 0, ngayTao: '2025-04-18', ngayCapNhat: '2025-04-18',
    },
];
