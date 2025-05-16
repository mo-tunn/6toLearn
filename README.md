


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)     

[![Build-passing](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

  
![Logo](https://i.hizliresim.com/hs4xb64.png)

    
# 6toLearn

6toLearn is a personalized quiz application designed to make English vocabulary learning permanent and effective. Each user creates a custom word list tailored to their needs and adds both the English words and their Turkish meanings to the system. The main goal of the application is to ensure that learned words are stored in long-term memory.

Each word is tested a total of 6 times at specific intervals. When a user answers a word correctly, it progresses one step forward. Words that successfully pass all tests are considered 100% learned. This method prevents forgetting by using a repetition- and reinforcement-based learning model.

The newly integrated GPT 3.5 AI-powered learning module analyzes the words that users struggle with and offers personalized suggestions accordingly. This allows each user to optimize their learning process based on data and achieve more efficient results.

6toLearn focuses on understanding and consistent repetition rather than rote memorization. You can create a personalized learning experience by entering your own words, track your progress, and systematically strengthen your English vocabulary.

📚 6 words, 6 repetitions, permanent learning.    
🤖 Personalized suggestions powered by AI.    
🚀 Achieve success with your own words!


## Used Technologies

React , Java Maven , Spring Boot , MySQL , OpenAI API

  
## Run in your computer

Clone the project

```bash
  git clone https://github.com/mo-tunn/6tolearn
```

Go to the path

```bash
  cd Frontend
```

Install needed things

```bash
  npm install
```

Run the frontend side

```bash
  npm run start
```

For backend i used IntelliJ IDEA 2024.3.2.2 
```bash
  Open 6tolearndb/Backend folder with IDE and run application
```
+ "To run the project, you need to have MySQL Server installed and create a database named 6tolearndb."
+ "In addition, you should configure the email and database settings in the 6tolearn/Backend/application.properties file, and replace the apiKey field in 6tolearn/Frontend/src/services/openAIService.js with your own OpenAI API Key."

  
## 📦Modules

- 🔤 Custom Vocabulary Creation
Users can add their own English words along with their Turkish meanings to build a personalized vocabulary list.
- 📊 Progress Tracking & Reports
Users can view their added words, track their performance through topic-based percentage success rates, and print detailed reports.
- ⏳ Interval-Based Quizzes
Users take quizzes on their saved words at specific time intervals to reinforce learning through repetition.
- 🧩 Wordle Game with Learned Words
Users can play a Wordle-style game using only the words they have mastered in the learned pool, making it both fun and educational.

- 🤖 AI-Powered Story & Image Generator
Users can generate creative stories and visuals using their own vocabulary with the help of AI models.

+All user-generated data, including words, quiz results, AI-generated content, and reports, are securely stored in the database.

  
## Video
[Click for watch the trailer video ](https://www.youtube.com/watch?v=yiXpvbdAqtY)

## SonarQube Test Results
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/kuojz7m.png?_gl=1*serinx*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjI4MDAkajQ0JGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
## Scrum Table
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/j1vkert.png?_gl=1*hl1yym*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjI5MTEkajM2JGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
## Screenshots

![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/fmakvnv.jpg?_gl=1*xag5o2*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjA3NzQkajU0JGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/oj8n8vd.jpg?_gl=1*j5vdxn*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjA5MDUkajIyJGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/fosr7jf.jpg?_gl=1*1g0ph36*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjEwMjckajQwJGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/bwqslkq.jpg?_gl=1*12wlaay*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjExMzYkajMzJGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/nvagqu4.jpg?_gl=1*1nkdjhf*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjEyNzYkajI0JGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/nxnz209.jpg?_gl=1*66h82v*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjE0MDgkajU1JGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/nu0dduj.jpg?_gl=1*79goq5*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjE1MjgkajIyJGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/g47ysc4.jpg?_gl=1*1bkqif8*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjE2MjUkajMxJGwwJGgw)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/jzw5tqi.jpg?_gl=1*157a4i9*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjE3MTQkajM5JGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/5qi5fxe.jpg?_gl=1*c7nfpw*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjE4MjIkajMzJGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/m9ym905.jpg?_gl=1*104uab7*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjE5ODIkajE3JGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/afxt7pv.jpg?_gl=1*ulp0e0*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjIwNjYkajQyJGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/m0cvhd3.jpg?_gl=1*p59i4v*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjIxNDUkajM5JGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
![Uygulama Ekran Görüntüsü](https://i.hizliresim.com/3d0vtnu.jpg?_gl=1*1uyje97*_ga*OTkwMzgwOTIyLjE3NDIxMjM3NjU.*_ga_M9ZRXYS2YN*czE3NDc0MjA2MzYkbzUkZzEkdDE3NDc0MjIyMzAkajM1JGwwJGgwJGRvekszWUJWSk5uR19tQ19kN2JJY3NsY0FvdWlaS0gtNDhn)
  