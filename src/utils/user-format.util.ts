export function formatUser(user: any) {
    return {
      id: user.login.uuid,
      gender: user.gender,
      name: user.name.first + user.name.last ,
      address: {
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        street: user.location.street.name,
      },
      email: user.email,
      age: user.dob.age,
      picture: user.picture.large,
      createdAt: new Date(),
    };
  }