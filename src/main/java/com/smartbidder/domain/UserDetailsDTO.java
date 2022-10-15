package com.smartbidder.domain;

import com.smartbidder.config.Constants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

@Data
public class UserDetailsDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotBlank
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    private String login;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Email
    @Size(min = 5, max = 254)
    private String email;

    private Set<String> authorities;


    public UserDetailsDTO(UserDetails userDetails){
        this.id=userDetails.getId();
        this.login=userDetails.getLogin();
        this.firstName=userDetails.getFirstName();
        this.lastName=userDetails.getLastName();
        this.email=userDetails.getEmail();
    }

}
