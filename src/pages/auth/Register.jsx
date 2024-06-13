import { useState } from "react";
import { Button, Form, Input, Carousel, message } from "antd";
import { Link } from "react-router-dom";
import AuthCarousel from "../../components/auth/AuthCarousel";
import { registerUser } from "../../services/firebaseConfig";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async e => {
    try {
      const user = await registerUser(email, password, name);
      if (user) {
        console.log("Kayıt başarılı:", user);
        // Kayıt başarılı mesajı göster
        message.success("Kayıt başarılı!");
        
      } else {
        console.log("Kayıt başarısız: null döndü");
        // Kayıt başarısız mesajı göster
        message.error("Kayıt başarısız!");
      }
    } catch (error) {
      // Hata durumunda hata mesajını göster
      console.error("Kayıt işlemi sırasında hata oluştu:", error);
      message.error("Kayıt işlemi sırasında bir hata oluştu!");
    }
  }
  

  return (
    <div className="h-screen">
      <div className="flex justify-between h-full">
        <div className="xl:px-20 px-10 w-full flex flex-col h-full justify-center relative">
          <h1 className="text-center text-5xl font-bold mb-2">LOGO</h1>
          <Form layout="vertical" onFinish={handleSubmit}> 
            <Form.Item
              label="Ad"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Kullanıcı Adı Alanı Boş Bırakılamaz!",
                },
              ]}
            >
<Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                {
                  required: true,
                  message: "E-mail Alanı Boş Bırakılamaz!",
                },
              ]}
            >
              <Input type="text" value={email}  onChange={e => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Şifre"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Şifre Alanı Boş Bırakılamaz!",
                },
              ]}
            >
              <Input.Password type="text" value={password}  onChange={e => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Şifre Tekrar"
              name="passwordAgain"
              rules={[
                {
                  required: true,
                  message: "Şifre Tekrar Alanı Boş Bırakılamaz!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
              >
                Kaydol
              </Button>
            </Form.Item>
          </Form>

          <div className="flex justify-center absolute left-0 bottom-10 w-full">
            Bir hesabınız var mı?&nbsp;
            <Link to="/login" className="text-blue-600">
              Şimdi giriş yap
            </Link>
          </div>
        </div>
        <div className="xl:w-4/6 lg:w-3/5 md:w-1/2 md:flex hidden bg-[#6c63ff] h-full">
          <div className="w-full h-full flex items-center">
            <div className="w-full">
              <Carousel className="!h-full px-6" autoplay>
                <AuthCarousel
                  img="/images/debts.svg"
                  title="Borç Yönetimi"
                  desc="Tüm Borçlarınızı Yönetmek Hiç Bu Kadar Kolay Olmamıştı!"
                />
                <AuthCarousel
                  img="/images/payments.svg"
                  title="Finansal Takip"
                  desc="Sizlere Sunulan Kolay İşleyiş"
                />
                <AuthCarousel
                  img="/images/customer.svg"
                  title="Müşteri Memnuniyeti"
                  desc="Deneyim Sonunda Üründen Memnun Müşteriler"
                />
                <AuthCarousel
                  img="/images/panel.svg"
                  title="Yönetici Paneli"
                  desc="Tek Yerden Yönetim"
                />
              </Carousel>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Register;
